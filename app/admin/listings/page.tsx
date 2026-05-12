'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Ban, CheckCircle2, Eye, FilePenLine, Save, Search, Trash2 } from 'lucide-react';
import FilterTabs from '@/components/ui/FilterTabs';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import StatusBadge from '@/components/ui/StatusBadge';
import { TablePageSkeleton } from '@/components/ui/loading-skeletons';

type ListingRow = {
  id: string;
  type: 'hotel' | 'tour' | 'rental' | 'activity';
  title: string;
  ownerName: string;
  city: string;
  status: string;
  isActive: boolean;
  isApproved: boolean;
  price: number;
  inventoryLabel: string;
  inventoryDetails: { id?: string; label: string; pricePerNight?: number; originalPrice?: number; available: number; total: number; isActive?: boolean }[];
  bookings: number;
  reviews: number;
  createdAt: string;
};

const listingTypes = ['all', 'hotel', 'tour', 'rental', 'activity'];
const statusTabs = ['all', 'PENDING_REVIEW', 'ACTIVE', 'REJECTED', 'PAUSED', 'ARCHIVED'];
const typeByPath: Record<string, ListingRow['type']> = {
  '/admin/hotels': 'hotel',
  '/admin/tours': 'tour',
  '/admin/rentals': 'rental',
};

export default function AdminListingsPage() {
  const pathname = usePathname();
  const lockedType = typeByPath[pathname ?? ''];
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<string>(lockedType ?? 'all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ListingRow | null>(null);
  const [selectedDraft, setSelectedDraft] = useState<ListingRow | null>(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '100',
        type,
        status,
        search,
      });
      const response = await fetch(`/api/admin/listings?${params.toString()}`, { cache: 'no-store' });
      const payload = await response.json();
      setListings(payload.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lockedType) setType(lockedType);
  }, [lockedType]);

  useEffect(() => {
    void fetchListings();
  }, [type, status]);

  const stats = useMemo(() => ({
    total: listings.length,
    pending: listings.filter((item) => item.status === 'PENDING_REVIEW').length,
    live: listings.filter((item) => item.status === 'ACTIVE').length,
    disabled: listings.filter((item) => item.status === 'PAUSED' || item.status === 'ARCHIVED').length,
  }), [listings]);

  const pageCopy = {
    all: {
      eyebrow: 'Listing governance',
      title: 'Listing review center',
      description: 'Approve, reject, disable, and audit host-created hotels, tours, rentals, and activities.',
    },
    hotel: {
      eyebrow: 'Hotel governance',
      title: 'Hotel listings',
      description: 'Review every hotel submitted by hosts before it becomes visible to users.',
    },
    tour: {
      eyebrow: 'Tour governance',
      title: 'Tour listings',
      description: 'Review every tour package submitted by hosts before it becomes visible to users.',
    },
    rental: {
      eyebrow: 'Rental governance',
      title: 'Rental listings',
      description: 'Review every rental submitted by hosts before it becomes visible to users.',
    },
    activity: {
      eyebrow: 'Activity governance',
      title: 'Activity listings',
      description: 'Review every activity submitted by hosts before it becomes visible to users.',
    },
  }[lockedType ?? 'all'];

  const openListing = (row: ListingRow) => {
    setSelected(row);
    setSelectedDraft({
      ...row,
      inventoryDetails: row.inventoryDetails.map((item) => ({ ...item })),
    });
  };

  const closeListing = () => {
    setSelected(null);
    setSelectedDraft(null);
  };

  const updateListing = async (row: ListingRow, nextStatus?: string, isActive?: boolean) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/listings/${row.type}/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          isActive,
          title: selectedDraft?.title,
          rooms: row.type === 'hotel' ? selectedDraft?.inventoryDetails.map((room) => ({
            id: room.id,
            pricePerNight: room.pricePerNight,
            originalPrice: room.originalPrice,
            totalRooms: room.total,
            availableRooms: room.available,
            isActive: room.isActive,
          })) : undefined,
          reason: decisionReason.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update listing');
      }

      closeListing();
      setDecisionReason('');
      await fetchListings();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-blue-50 text-blue-800">
                <FilePenLine className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-800">{pageCopy.eyebrow}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{pageCopy.title}</h1>
                <p className="mt-2 text-sm text-slate-600">{pageCopy.description}</p>
              </div>
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              {stats.pending} waiting for review
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-4">
          {[
            ['Total listings', stats.total],
            ['Pending review', stats.pending],
            ['Live listings', stats.live],
            ['Disabled/archived', stats.disabled],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') void fetchListings();
                }}
                placeholder="Search listings, owners, or city"
                className="pl-11"
              />
            </div>
            <button
              onClick={() => fetchListings()}
              className="rounded-2xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-blue-900"
            >
              Search
            </button>
          </div>
          {!lockedType ? (
            <FilterTabs tabs={listingTypes} active={type} onChange={(tab) => setType(tab)} formatLabel={(tab) => tab === 'all' ? 'All types' : tab} />
          ) : null}
          <FilterTabs tabs={statusTabs} active={status} onChange={(tab) => setStatus(tab)} formatLabel={(tab) => tab === 'all' ? 'All statuses' : tab.replaceAll('_', ' ')} />
        </div>

        {loading ? (
          <TablePageSkeleton />
        ) : (
          <div className="overflow-x-auto rounded-[32px] border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Listing</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Owner</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">City</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Availability</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Bookings</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Price</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {listings.map((row) => (
                  <tr key={`${row.type}-${row.id}`} className="transition hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-950">{row.title}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{row.type}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{row.ownerName}</td>
                    <td className="px-6 py-4 text-slate-600">{row.city}</td>
                    <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{row.inventoryLabel}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{row.bookings}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{row.price ? `₹${row.price.toLocaleString('en-IN')}` : '-'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => openListing(row)} className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800 transition hover:bg-blue-800 hover:text-white">
                        <Eye className="h-3.5 w-3.5" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal open={!!selected} onClose={closeListing} title="Review listing" maxWidth="max-w-2xl">
          {selected && selectedDraft ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <input
                  value={selectedDraft.title}
                  onChange={(event) => setSelectedDraft((current) => current ? { ...current, title: event.target.value } : current)}
                  className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-lg font-bold text-slate-950 outline-none transition focus:border-blue-400"
                />
                <p className="mt-1 text-sm text-slate-600">{selected.type} by {selected.ownerName}</p>
                <div className="mt-3"><StatusBadge status={selected.status} /></div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Host availability</p>
                <div className="mt-3 space-y-2">
                  {selectedDraft.inventoryDetails.map((item, index) => (
                    <div key={item.id ?? item.label} className="rounded-xl bg-slate-50 p-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-slate-700">{item.label}</span>
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <input
                            type="checkbox"
                            checked={item.isActive ?? true}
                            onChange={(event) => setSelectedDraft((current) => current ? {
                              ...current,
                              inventoryDetails: current.inventoryDetails.map((room, roomIndex) => roomIndex === index ? { ...room, isActive: event.target.checked } : room),
                            } : current)}
                          />
                          Active
                        </label>
                      </div>
                      {selected.type === 'hotel' ? (
                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          <label className="text-xs font-semibold text-slate-600">
                            Price
                            <input
                              type="number"
                              min="0"
                              value={item.pricePerNight ?? 0}
                              onChange={(event) => setSelectedDraft((current) => current ? {
                                ...current,
                                inventoryDetails: current.inventoryDetails.map((room, roomIndex) => roomIndex === index ? { ...room, pricePerNight: Number(event.target.value) } : room),
                              } : current)}
                              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-950 outline-none focus:border-blue-400"
                            />
                          </label>
                          <label className="text-xs font-semibold text-slate-600">
                            Available
                            <input
                              type="number"
                              min="0"
                              max={item.total}
                              value={item.available}
                              onChange={(event) => setSelectedDraft((current) => current ? {
                                ...current,
                                inventoryDetails: current.inventoryDetails.map((room, roomIndex) => roomIndex === index ? { ...room, available: Number(event.target.value) } : room),
                              } : current)}
                              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-950 outline-none focus:border-blue-400"
                            />
                          </label>
                          <label className="text-xs font-semibold text-slate-600">
                            Total
                            <input
                              type="number"
                              min="1"
                              value={item.total}
                              onChange={(event) => setSelectedDraft((current) => current ? {
                                ...current,
                                inventoryDetails: current.inventoryDetails.map((room, roomIndex) => roomIndex === index ? { ...room, total: Number(event.target.value) } : room),
                              } : current)}
                              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-950 outline-none focus:border-blue-400"
                            />
                          </label>
                        </div>
                      ) : (
                        <p className="mt-2 font-bold text-slate-950">{item.available} / {item.total}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <textarea
                value={decisionReason}
                onChange={(event) => setDecisionReason(event.target.value)}
                placeholder="Decision note or change request"
                rows={4}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <button disabled={saving} onClick={() => updateListing(selected, 'ACTIVE', true)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:opacity-50">
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </button>
                <button disabled={saving} onClick={() => updateListing(selected, 'REJECTED', false)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-50 disabled:opacity-50">
                  Reject
                </button>
                <button disabled={saving} onClick={() => updateListing(selected, 'PAUSED', false)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-50 disabled:opacity-50">
                  <Ban className="h-4 w-4" />
                  Disable
                </button>
                <button disabled={saving} onClick={() => updateListing(selected, 'ARCHIVED', false)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-50 disabled:opacity-50">
                  <Trash2 className="h-4 w-4" />
                  Soft delete
                </button>
                <button disabled={saving} onClick={() => updateListing(selected)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 sm:col-span-2">
                  <Save className="h-4 w-4" />
                  Save details
                </button>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </div>
  );
}
