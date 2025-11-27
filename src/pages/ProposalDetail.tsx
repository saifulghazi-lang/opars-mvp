import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { SignatureModal } from '../components/ui/SignatureModal';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ExternalLink, ThumbsUp, ThumbsDown, Keyboard } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '../components/ui/Spinner';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface Proposal {
    id: string;
    title: string;
    pdf_url: string;
    status: string;
    department: string;
    created_at: string;
    signed_off: boolean;
}

interface Review {
    id: string;
    vote_status: 'Approve' | 'Reject' | 'Pending';
    comments: string;
    reviewer_id: string;
}

interface Member {
    id: string;
    email: string;
    department: string;
}

interface VoteStatusMember extends Member {
    hasVoted: boolean;
    voteStatus?: 'Approve' | 'Reject';
}

export function ProposalDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [voteStatus, setVoteStatus] = useState<VoteStatusMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [rejectComment, setRejectComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showKeyboardHint, setShowKeyboardHint] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!id || !user) return;

            const { data: proposalData, error: proposalError } = await supabase
                .from('proposals')
                .select('*')
                .eq('id', id)
                .single();

            if (proposalError) {
                console.error('Error fetching proposal:', proposalError);
                return;
            }
            setProposal(proposalData);

            const { data: reviewData } = await supabase
                .from('reviews')
                .select('*')
                .eq('proposal_id', id)
                .eq('reviewer_id', user.id)
                .single();

            if (reviewData) setUserReview(reviewData);

            // Fetch all members and their vote status (for admins)
            if (user.role === 'admin') {
                const { data: members } = await supabase
                    .from('profiles')
                    .select('id, email, department')
                    .eq('role', 'member');

                const { data: allReviews } = await supabase
                    .from('reviews')
                    .select('reviewer_id, vote_status')
                    .eq('proposal_id', id);

                if (members && allReviews) {
                    const reviewMap = new Map(allReviews.map(r => [r.reviewer_id, r.vote_status]));
                    const statusList: VoteStatusMember[] = members.map(member => ({
                        ...member,
                        hasVoted: reviewMap.has(member.id),
                        voteStatus: reviewMap.get(member.id),
                    }));
                    setVoteStatus(statusList);
                }
            }

            setLoading(false);
        }

        fetchData();
    }, [id, user]);

    const handleVote = async (vote: 'Approve' | 'Reject', comments: string = '', signature?: string) => {
        if (!user || !proposal) return;
        setSubmitting(true);

        // SIMULATION MODE (For Dev/Testing without real Auth)
        if (user.id === 'dev-admin-id') {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Skip database call, go straight to success
            console.log('SIMULATION: Vote submitted', { vote, comments, signature });
        } else {
            // REAL MODE
            // FALLBACK: Direct Database Insert (Bypassing Edge Function due to CORS/Network issues)
            const { error } = await supabase
                .from('reviews')
                .upsert({
                    proposal_id: proposal.id,
                    reviewer_id: user.id,
                    vote_status: vote,
                    comments: comments,
                    signature_data: signature, // Store signature
                }, { onConflict: 'proposal_id,reviewer_id' });

            if (error) {
                console.error('Error submitting vote:', error);
                toast.error('Failed to submit vote');
                setSubmitting(false);
                return;
            }
        }

        // Optimistic update (Runs for both Real and Simulation modes)
        setUserReview({
            id: userReview?.id || 'temp',
            vote_status: vote,
            comments: comments,
            reviewer_id: user.id,
        });

        // If approved, check if we should update proposal status (Optimistic)
        if (vote === 'Approve') {
            // In simulation/dev mode, or if pending, switch to Reviewing
            if (proposal.status === 'Pending' || user.id === 'dev-admin-id') {
                setProposal(prev => prev ? ({ ...prev, status: 'Reviewing' }) : null);
            }
        }

        setIsRejectModalOpen(false);
        setIsSignatureModalOpen(false);
        toast.success(`Vote Recorded: ${vote === 'Approve' ? 'Approved' : 'Rejected'}`);

        // Hide keyboard hint after first vote
        setShowKeyboardHint(false);

        setSubmitting(false);
    };

    const handleApproveClick = () => {
        // Open signature modal instead of submitting directly
        setIsSignatureModalOpen(true);
    };

    const handleSignatureConfirm = (signature: string) => {
        // Submit approval with signature
        handleVote('Approve', '', signature);
    };

    // Keyboard shortcuts
    useKeyboardShortcuts({
        onApprove: () => {
            if (!userReview && !submitting) {
                handleApproveClick();
            }
        },
        onReject: () => {
            if (!userReview && !submitting) {
                setIsRejectModalOpen(true);
            }
        },
        onEscape: () => {
            setIsRejectModalOpen(false);
            setShowKeyboardHint(false);
        },
        enabled: !userReview, // Only enable shortcuts if user hasn't voted yet
    });

    if (loading) return <div className="flex justify-center p-8"><Spinner className="h-8 w-8 text-primary" /></div>;
    if (!proposal) return <div className="p-8">Proposal not found</div>;

    return (
        <div className="space-y-6 pb-24">
            <Button variant="ghost" onClick={() => navigate('/')} className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Button>

            {/* Keyboard Hint Banner - Hidden on mobile */}
            {showKeyboardHint && !userReview && (
                <div className="hidden md:block max-w-3xl mx-auto">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <Keyboard className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-blue-900">Power User Tip</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                    Press <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-mono">A</kbd> to Approve
                                    or <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-mono">R</kbd> to Reject
                                </p>
                            </div>
                            <button
                                onClick={() => setShowKeyboardHint(false)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex-shrink-0"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sticky Decision Card - Bottom on Mobile, Top on Desktop */}
            {!userReview && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t z-50 md:static md:bg-transparent md:border-none md:p-0 md:mb-8 md:sticky md:top-6">
                    <div className="max-w-3xl mx-auto">
                        <Card className="border-yellow-300 shadow-lg bg-white/95 backdrop-blur-sm">
                            <CardContent className="p-4 md:pt-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                                    <p className="text-sm text-muted-foreground flex-shrink-0 hidden md:block">Cast your vote:</p>
                                    <div className="flex gap-3 flex-1 md:max-w-md">
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold"
                                            onClick={handleApproveClick}
                                            disabled={submitting}
                                        >
                                            <ThumbsUp className="mr-2 h-5 w-5" />
                                            Approve
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="flex-1 h-12 text-base font-semibold"
                                            onClick={() => setIsRejectModalOpen(true)}
                                            disabled={submitting}
                                        >
                                            <ThumbsDown className="mr-2 h-5 w-5" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Main Content - Single Column */}
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Vote Confirmation (if already voted) */}
                {userReview && (
                    <Card className={cn(
                        "border-2",
                        userReview.vote_status === 'Approve' ? "border-green-200 bg-green-50/50" :
                            "border-red-200 bg-red-50/50"
                    )}>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-3">
                                <div className={cn(
                                    "inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold",
                                    userReview.vote_status === 'Approve'
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                )}>
                                    {userReview.vote_status === 'Approve' ? (
                                        <ThumbsUp className="h-4 w-4" />
                                    ) : (
                                        <ThumbsDown className="h-4 w-4" />
                                    )}
                                    You voted: {userReview.vote_status}
                                </div>
                                {userReview.comments && (
                                    <div className="text-sm text-muted-foreground bg-white/80 p-4 rounded-md border max-w-prose mx-auto">
                                        "{userReview.comments}"
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Vote Tracker (Admin Only) */}
                {user?.role === 'admin' && voteStatus.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Voting Status</CardTitle>
                                    <CardDescription className="mt-1">
                                        {voteStatus.filter(m => m.hasVoted).length} of {voteStatus.length} members have voted
                                    </CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold font-serif text-primary">
                                        {Math.round((voteStatus.filter(m => m.hasVoted).length / voteStatus.length) * 100)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">Complete</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-0 divide-y divide-border">
                                {voteStatus.map((member) => (
                                    <div key={member.id} className="py-3 flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{member.email}</div>
                                            <div className="text-xs text-muted-foreground font-serif">{member.department}</div>
                                        </div>
                                        <div>
                                            {member.hasVoted ? (
                                                <Badge status={member.voteStatus === 'Approve' ? 'Decided' : 'Reviewing'} className="text-xs">
                                                    {member.voteStatus === 'Approve' ? (
                                                        <><ThumbsUp className="h-3 w-3" /> Approved</>
                                                    ) : (
                                                        <><ThumbsDown className="h-3 w-3" /> Rejected</>
                                                    )}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                                    Pending
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Proposal Details */}
                <Card>
                    <CardHeader className="space-y-4 pb-8">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 max-w-prose">
                                <CardTitle className="text-3xl leading-tight mb-3">{proposal.title}</CardTitle>
                                <CardDescription className="text-base font-serif">
                                    {proposal.department} • {new Date(proposal.created_at).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </CardDescription>
                            </div>
                            <Badge status={proposal.status as any} />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* PDF Viewer */}
                        <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center border border-dashed">
                            <div className="text-center space-y-4 p-8">
                                <p className="text-muted-foreground">PDF Preview Placeholder</p>
                                <a href={proposal.pdf_url} target="_blank" rel="noreferrer">
                                    <Button variant="outline" size="lg">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Open PDF
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                title="Reject Proposal"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleVote('Reject', rejectComment)}
                            disabled={!rejectComment.trim() || submitting}
                        >
                            Confirm Rejection
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Please provide a reason for rejecting this proposal. This feedback will be visible to the author.
                    </p>
                    <textarea
                        className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Enter your comments here..."
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                        autoFocus
                    />
                </div>
            </Modal>

            {/* Signature Modal for Approval */}
            <SignatureModal
                isOpen={isSignatureModalOpen}
                onClose={() => setIsSignatureModalOpen(false)}
                onConfirm={handleSignatureConfirm}
                title="Confirm Approval"
            />
        </div>
    );
}
