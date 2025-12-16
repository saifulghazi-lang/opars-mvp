import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, FileText, X } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';

interface Proposal {
    id: string;
    title: string;
    status: 'Pending' | 'Reviewing' | 'Decided';
    department: string;
    created_at: string;
}

type StatusFilter = 'All' | 'Pending' | 'Reviewing' | 'Decided';

export function ProposalsList() {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
    const [departmentFilter, setDepartmentFilter] = useState<string>('All');

    useEffect(() => {
        async function fetchProposals() {
            const { data, error } = await supabase
                .from('proposals')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching proposals:', error);
            } else {
                setProposals(data || []);
            }
            setLoading(false);
        }

        fetchProposals();
    }, []);

    // Get unique departments for filter dropdown
    const departments = useMemo(() => {
        const deptSet = new Set(proposals.map(p => p.department));
        return ['All', ...Array.from(deptSet).sort()];
    }, [proposals]);

    // Filter proposals based on search and filters
    const filteredProposals = useMemo(() => {
        return proposals.filter(proposal => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                proposal.department.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            const matchesStatus = statusFilter === 'All' || proposal.status === statusFilter;

            // Department filter
            const matchesDepartment = departmentFilter === 'All' || proposal.department === departmentFilter;

            return matchesSearch && matchesStatus && matchesDepartment;
        });
    }, [proposals, searchQuery, statusFilter, departmentFilter]);

    const hasActiveFilters = searchQuery !== '' || statusFilter !== 'All' || departmentFilter !== 'All';

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('All');
        setDepartmentFilter('All');
    };

    return (
        <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">All Proposals</h2>
                    <p className="text-muted-foreground mt-1 md:mt-2">
                        Browse and filter all proposals in the system
                    </p>
                </div>
            </div>

            {/* Filters Card */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search proposals..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                            className="px-4 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Reviewing">Reviewing</option>
                            <option value="Decided">Decided</option>
                        </select>

                        {/* Department Filter */}
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="px-4 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all cursor-pointer"
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>
                                    {dept === 'All' ? 'All Departments' : dept}
                                </option>
                            ))}
                        </select>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>

                    {/* Active Filters Summary */}
                    {hasActiveFilters && (
                        <div className="mt-4 text-sm text-muted-foreground">
                            Showing {filteredProposals.length} of {proposals.length} proposals
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Proposals List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Proposals
                        <span className="text-muted-foreground font-normal text-base">
                            ({filteredProposals.length})
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Spinner className="h-8 w-8 text-primary" />
                        </div>
                    ) : filteredProposals.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                {hasActiveFilters
                                    ? 'No proposals match your filters.'
                                    : 'No proposals found.'}
                            </p>
                            {hasActiveFilters && (
                                <Button
                                    variant="link"
                                    onClick={clearFilters}
                                    className="mt-2"
                                >
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-0 divide-y divide-border">
                            {filteredProposals.map((proposal) => (
                                <Link
                                    key={proposal.id}
                                    to={`/proposals/${proposal.id}`}
                                    className="flex items-center justify-between py-4 px-4 -mx-4 hover:bg-accent/50 transition-colors group"
                                >
                                    <div className="flex flex-col gap-1.5 flex-1 min-w-0 mr-4">
                                        <div className="font-semibold text-base group-hover:text-primary transition-colors truncate">
                                            {proposal.title}
                                        </div>
                                        <div className="text-sm text-muted-foreground font-serif truncate">
                                            {proposal.department} • {new Date(proposal.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                                        <div className="scale-90 md:scale-100 origin-right">
                                            <Badge status={proposal.status} />
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
