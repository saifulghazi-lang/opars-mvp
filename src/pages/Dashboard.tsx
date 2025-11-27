import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Plus, FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';

interface Proposal {
    id: string;
    title: string;
    status: 'Pending' | 'Reviewing' | 'Decided';
    department: string;
    created_at: string;
}

interface Review {
    proposal_id: string;
}

export function Dashboard() {
    const { user } = useAuth();
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [userReviews, setUserReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            // Fetch proposals
            const { data: proposalsData, error: proposalsError } = await supabase
                .from('proposals')
                .select('*')
                .order('created_at', { ascending: false });

            if (proposalsError) {
                console.error('Error fetching proposals:', proposalsError);
            } else {
                setProposals(proposalsData || []);
            }

            // Fetch user's reviews for "Inbox Zero" filtering
            if (user) {
                const { data: reviewsData } = await supabase
                    .from('reviews')
                    .select('proposal_id')
                    .eq('reviewer_id', user.id);

                setUserReviews(reviewsData || []);
            }

            setLoading(false);
        }

        fetchData();
    }, [user]);

    // "Inbox Zero" - Filter out proposals user has already voted on
    const reviewedProposalIds = new Set(userReviews.map(r => r.proposal_id));
    const pendingProposals = proposals.filter(p => !reviewedProposalIds.has(p.id));


    const stats = [
        { label: 'Requires Your Attention', value: pendingProposals.length, icon: Clock, color: 'text-yellow-600' },
        { label: 'In Progress', value: proposals.filter(p => p.status === 'Reviewing').length, icon: FileText, color: 'text-blue-600' },
        { label: 'Decided', value: proposals.filter(p => p.status === 'Decided').length, icon: CheckCircle, color: 'text-green-600' },
    ];

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Command Center</h2>
                    <p className="text-muted-foreground mt-2">Welcome back, {user?.email}</p>
                </div>
                {user?.role === 'admin' && (
                    <Link to="/proposals/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Proposal
                        </Button>
                    </Link>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold font-serif">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Inbox Zero - Requires Your Attention */}
            {user?.role === 'member' && pendingProposals.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            Requires Your Attention
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-0 divide-y divide-border">
                            {pendingProposals.map((proposal) => (
                                <Link
                                    key={proposal.id}
                                    to={`/proposals/${proposal.id}`}
                                    className="flex items-center justify-between py-4 px-4 -mx-4 hover:bg-accent/50 transition-colors group"
                                >
                                    <div className="flex flex-col gap-1.5 flex-1">
                                        <div className="font-semibold text-base group-hover:text-primary transition-colors">
                                            {proposal.title}
                                        </div>
                                        <div className="text-sm text-muted-foreground font-serif">
                                            {proposal.department} • {new Date(proposal.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge status={proposal.status} />
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* All Proposals */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {user?.role === 'member' ? 'All Proposals' : 'Recent Proposals'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8"><Spinner className="h-8 w-8 text-primary" /></div>
                    ) : proposals.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No proposals found.</p>
                    ) : (
                        <div className="space-y-0 divide-y divide-border">
                            {proposals.map((proposal) => (
                                <Link
                                    key={proposal.id}
                                    to={`/proposals/${proposal.id}`}
                                    className="flex items-center justify-between py-4 px-4 -mx-4 hover:bg-accent/50 transition-colors group"
                                >
                                    <div className="flex flex-col gap-1.5 flex-1">
                                        <div className="font-semibold text-base group-hover:text-primary transition-colors">
                                            {proposal.title}
                                        </div>
                                        <div className="text-sm text-muted-foreground font-serif">
                                            {proposal.department} • {new Date(proposal.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge status={proposal.status} />
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Inbox Zero Achievement */}
            {user?.role === 'member' && pendingProposals.length === 0 && proposals.length > 0 && (
                <Card className="border-green-200 bg-green-50/30">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-green-900">Inbox Zero Achieved!</h3>
                            <p className="text-sm text-green-700 mt-1">You've reviewed all pending proposals.</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
