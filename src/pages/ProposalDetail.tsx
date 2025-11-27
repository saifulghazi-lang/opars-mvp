import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';

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

export function ProposalDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectComment, setRejectComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

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
            setLoading(false);
        }

        fetchData();
    }, [id, user]);

    const handleVote = async (vote: 'Approve' | 'Reject', comments: string = '') => {
        if (!user || !proposal) return;
        setSubmitting(true);

        const { error } = await supabase
            .from('reviews')
            .upsert({
                proposal_id: proposal.id,
                reviewer_id: user.id,
                vote_status: vote,
                comments: comments,
            }, { onConflict: 'proposal_id,reviewer_id' });

        if (error) {
            console.error('Error submitting vote:', error);
            alert('Failed to submit vote');
        } else {
            // Optimistic update
            setUserReview({
                id: userReview?.id || 'temp',
                vote_status: vote,
                comments: comments,
                reviewer_id: user.id,
            });

            // If approved, check if we should update proposal status (simplified logic for MVP)
            if (vote === 'Approve') {
                // In a real app, we'd check if all reviewers approved.
                // For MVP, let's just update status to Decided if Admin approves or something.
                // Actually, let's just leave it as is for now, maybe update status to Reviewing if it was Pending.
                if (proposal.status === 'Pending') {
                    await supabase.from('proposals').update({ status: 'Reviewing' }).eq('id', proposal.id);
                    setProposal({ ...proposal, status: 'Reviewing' });
                }
            } else if (vote === 'Reject') {
                // If rejected, maybe set to Decided immediately?
                // For MVP, let's keep it simple.
            }

            setIsRejectModalOpen(false);
        }
        setSubmitting(false);
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!proposal) return <div className="p-8">Proposal not found</div>;

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate('/')} className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Button>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">{proposal.title}</CardTitle>
                                    <CardDescription className="mt-1">
                                        {proposal.department} • Created {new Date(proposal.created_at).toLocaleDateString()}
                                    </CardDescription>
                                </div>
                                <Badge variant={
                                    proposal.status === 'Decided' ? 'success' :
                                        proposal.status === 'Reviewing' ? 'secondary' : 'warning'
                                }>
                                    {proposal.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center border border-dashed">
                                <div className="text-center">
                                    <p className="text-muted-foreground mb-4">PDF Preview Placeholder</p>
                                    <a href={proposal.pdf_url} target="_blank" rel="noreferrer">
                                        <Button variant="outline">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Open PDF
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Vote</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {userReview ? (
                                <div className="space-y-4">
                                    <div className={cn(
                                        "p-4 rounded-lg border text-center font-medium",
                                        userReview.vote_status === 'Approve' ? "bg-green-50 text-green-700 border-green-200" :
                                            userReview.vote_status === 'Reject' ? "bg-red-50 text-red-700 border-red-200" :
                                                "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    )}>
                                        You voted: {userReview.vote_status}
                                    </div>
                                    {userReview.comments && (
                                        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                            "{userReview.comments}"
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">Please review the proposal and cast your vote.</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700"
                                            onClick={() => handleVote('Approve')}
                                            disabled={submitting}
                                        >
                                            <ThumbsUp className="mr-2 h-4 w-4" />
                                            Approve
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={() => setIsRejectModalOpen(true)}
                                            disabled={submitting}
                                        >
                                            <ThumbsDown className="mr-2 h-4 w-4" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
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
                    />
                </div>
            </Modal>
        </div>
    );
}
