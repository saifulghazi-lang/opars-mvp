import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Plus, FileText, CheckCircle, Clock } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';

interface Proposal {
    id: string;
    title: string;
    status: 'Pending' | 'Reviewing' | 'Decided';
    department: string;
    created_at: string;
}

export function Dashboard() {
    const { user } = useAuth();
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProposals() {
            // For MVP, just fetch all proposals. In real app, filter by role/dept.
            const { data, error } = await supabase
                .from('proposals')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) console.error('Error fetching proposals:', error);
            else setProposals(data || []);
            setLoading(false);
        }

        fetchProposals();
    }, []);

    const stats = [
        { label: 'Pending Review', value: proposals.filter(p => p.status === 'Pending').length, icon: Clock, color: 'text-yellow-500' },
        { label: 'In Progress', value: proposals.filter(p => p.status === 'Reviewing').length, icon: FileText, color: 'text-blue-500' },
        { label: 'Approved', value: proposals.filter(p => p.status === 'Decided').length, icon: CheckCircle, color: 'text-green-500' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Welcome back, {user?.email} ({user?.role})</p>
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
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Proposals</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-8"><Spinner className="h-8 w-8 text-primary" /></div>
                        ) : proposals.length === 0 ? (
                            <p className="text-muted-foreground">No proposals found.</p>
                        ) : (
                            proposals.map((proposal) => (
                                <div key={proposal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                    <div className="flex flex-col gap-1">
                                        <Link to={`/proposals/${proposal.id}`} className="font-medium hover:underline">
                                            {proposal.title}
                                        </Link>
                                        <span className="text-sm text-muted-foreground">{proposal.department} • {new Date(proposal.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <Badge variant={
                                        proposal.status === 'Decided' ? 'success' :
                                            proposal.status === 'Reviewing' ? 'secondary' : 'warning'
                                    }>
                                        {proposal.status}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
