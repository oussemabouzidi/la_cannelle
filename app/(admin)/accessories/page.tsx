"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  TrendingUp,
  Package,
  Menu,
  Clock,
  Users,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { useTranslation } from '@/lib/hooks/useTranslation';
import AdminLanguageToggle from '../components/AdminLanguageToggle';
import AdminLayout from '../components/AdminLayout';
import { accessoriesApi, type Accessory } from '@/lib/api/accessories';

type FormState = {
  id?: number;
  nameEn: string;
  nameDe: string;
  descriptionEn: string;
  descriptionDe: string;
  detailsEn: string;
  detailsDe: string;
  unitEn: string;
  unitDe: string;
  price: string;
  minQuantity: string;
  image: string;
  isActive: boolean;
};

const emptyForm = (): FormState => ({
  nameEn: '',
  nameDe: '',
  descriptionEn: '',
  descriptionDe: '',
  detailsEn: '',
  detailsDe: '',
  unitEn: '',
  unitDe: '',
  price: '0',
  minQuantity: '1',
  image: '',
  isActive: true
});

export default function AdminAccessories() {
  const { language, toggleLanguage } = useTranslation('admin');
  const [isVisible, setIsVisible] = useState(false);
  const locale = language === 'DE' ? 'de-DE' : 'en-US';

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [accessories, setAccessories] = useState<Accessory[]>([]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const copy = useMemo(() => {
    const isDE = language === 'DE';
    return {
      nav: {
        dashboard: isDE ? 'Ubersicht' : 'Dashboard',
        orders: isDE ? 'Bestellungen' : 'Orders',
        menu: isDE ? 'Menueverwaltung' : 'Menu Management',
        accessories: isDE ? 'Zubehoer' : 'Accessories',
        system: isDE ? 'Systemsteuerung' : 'System Control',
        customers: isDE ? 'Kunden' : 'Customers',
        reports: isDE ? 'Berichte' : 'Reports'
      },
      header: {
        title: isDE ? 'Zubehoer verwalten' : 'Accessories Management',
        subtitle: isDE
          ? 'Erstellen, bearbeiten und deaktivieren Sie optionales Zubehoer'
          : 'Create, edit, and deactivate optional accessories',
        add: isDE ? 'Zubehoer hinzufuegen' : 'Add Accessory',
        refresh: isDE ? 'Aktualisieren' : 'Refresh'
      },
      filters: {
        searchPlaceholder: isDE ? 'Suchen...' : 'Search...',
        all: isDE ? 'Alle' : 'All',
        active: isDE ? 'Aktiv' : 'Active',
        inactive: isDE ? 'Inaktiv' : 'Inactive'
      },
      table: {
        image: isDE ? 'Bild' : 'Image',
        name: isDE ? 'Name' : 'Name',
        price: isDE ? 'Preis' : 'Price',
        minQty: isDE ? 'Min. Menge' : 'Min Qty',
        status: isDE ? 'Status' : 'Status',
        updated: isDE ? 'Aktualisiert' : 'Updated',
        actions: isDE ? 'Aktionen' : 'Actions'
      },
      modal: {
        createTitle: isDE ? 'Zubehoer erstellen' : 'Create Accessory',
        editTitle: isDE ? 'Zubehoer bearbeiten' : 'Edit Accessory',
        save: isDE ? 'Speichern' : 'Save',
        cancel: isDE ? 'Abbrechen' : 'Cancel',
        english: isDE ? 'Englisch' : 'English',
        german: isDE ? 'Deutsch' : 'German',
        required: isDE ? 'Pflichtfeld' : 'Required'
      },
      fields: {
        nameEn: isDE ? 'Name (EN)' : 'Name (EN)',
        nameDe: isDE ? 'Name (DE)' : 'Name (DE)',
        descEn: isDE ? 'Beschreibung (EN)' : 'Description (EN)',
        descDe: isDE ? 'Beschreibung (DE)' : 'Description (DE)',
        detailsEn: isDE ? 'Details (EN)' : 'Details (EN)',
        detailsDe: isDE ? 'Details (DE)' : 'Details (DE)',
        unitEn: isDE ? 'Einheit (EN)' : 'Unit (EN)',
        unitDe: isDE ? 'Einheit (DE)' : 'Unit (DE)',
        price: isDE ? 'Preis' : 'Price',
        minQuantity: isDE ? 'Mindestmenge' : 'Minimum quantity',
        image: isDE ? 'Bild URL' : 'Image URL',
        isActive: isDE ? 'Aktiv' : 'Active'
      },
      toast: {
        saved: isDE ? 'Gespeichert' : 'Saved',
        deleted: isDE ? 'Geloescht' : 'Deleted',
        failedLoad: isDE ? 'Laden fehlgeschlagen' : 'Failed to load',
        failedSave: isDE ? 'Speichern fehlgeschlagen' : 'Failed to save',
        failedDelete: isDE ? 'Loeschen fehlgeschlagen' : 'Failed to delete'
      }
    };
  }, [language]);

  useEffect(() => {
    setIsVisible(true);
  }, []);


  const loadAccessories = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const data = await accessoriesApi.getAccessories();
      setAccessories(data);
    } catch (err: any) {
      setLoadError(err?.message || copy.toast.failedLoad);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccessories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredAccessories = useMemo(() => {
    const query = search.trim().toLowerCase();
    return accessories.filter((a) => {
      if (statusFilter === 'active' && !a.isActive) return false;
      if (statusFilter === 'inactive' && a.isActive) return false;
      if (!query) return true;
      const haystack = [
        a.nameEn,
        a.nameDe || '',
        a.descriptionEn,
        a.descriptionDe || ''
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [accessories, search, statusFilter]);

  const openCreate = () => {
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (accessory: Accessory) => {
    setForm({
      id: accessory.id,
      nameEn: accessory.nameEn || '',
      nameDe: accessory.nameDe || '',
      descriptionEn: accessory.descriptionEn || '',
      descriptionDe: accessory.descriptionDe || '',
      detailsEn: accessory.detailsEn || '',
      detailsDe: accessory.detailsDe || '',
      unitEn: accessory.unitEn || '',
      unitDe: accessory.unitDe || '',
      price: String(accessory.price ?? 0),
      minQuantity: String(accessory.minQuantity ?? 1),
      image: accessory.image || '',
      isActive: Boolean(accessory.isActive)
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm());
  };

  const saveAccessory = async () => {
    if (!form.nameEn.trim() || !form.descriptionEn.trim()) {
      return;
    }

    const payload: any = {
      nameEn: form.nameEn.trim(),
      nameDe: form.nameDe.trim() || null,
      descriptionEn: form.descriptionEn.trim(),
      descriptionDe: form.descriptionDe.trim() || null,
      detailsEn: form.detailsEn.trim() || null,
      detailsDe: form.detailsDe.trim() || null,
      unitEn: form.unitEn.trim() || null,
      unitDe: form.unitDe.trim() || null,
      price: Number(form.price),
      minQuantity: Number(form.minQuantity),
      image: form.image.trim() || null,
      isActive: form.isActive
    };

    try {
      setSaving(true);
      if (form.id) {
        const updated = await accessoriesApi.updateAccessory(form.id, payload);
        setAccessories((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        const created = await accessoriesApi.createAccessory(payload);
        setAccessories((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      setLoadError(copy.toast.failedSave);
    } finally {
      setSaving(false);
    }
  };

  const deleteAccessory = async (id: number) => {
    const ok = window.confirm('Delete this accessory?');
    if (!ok) return;
    try {
      await accessoriesApi.deleteAccessory(id);
      setAccessories((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      setLoadError(copy.toast.failedDelete);
    }
  };

  const navigation = [
    { id: 'dashboard', name: copy.nav.dashboard, icon: TrendingUp, path: '/dashboard' },
    { id: 'orders', name: copy.nav.orders, icon: Package, path: '/orders' },
    { id: 'menu', name: copy.nav.menu, icon: Menu, path: '/menu_management' },
    { id: 'accessories', name: copy.nav.accessories, icon: ShoppingBag, path: '/accessories' },
    { id: 'system', name: copy.nav.system, icon: Clock, path: '/system_control' },
    { id: 'customers', name: copy.nav.customers, icon: Users, path: '/customers' },
    { id: 'reports', name: copy.nav.reports, icon: DollarSign, path: '/reports' }
  ];

  return (
    <AdminLayout
      navigation={navigation}
      title={copy.header.title}
      adminUserLabel={language === 'DE' ? 'Admin Benutzer' : 'Admin User'}
      adminRoleLabel={language === 'DE' ? 'Administrator' : 'Administrator'}
      languageToggle={<AdminLanguageToggle language={language} onToggle={toggleLanguage} />}
      locale={locale}
      headerMeta={
        <div className="flex items-center gap-3">
          <button
            onClick={loadAccessories}
            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            type="button"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">{copy.header.refresh}</span>
          </button>
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-black transition-colors flex items-center gap-2"
            type="button"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{copy.header.add}</span>
          </button>
        </div>
      }
    >
      <div className={`${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 mb-6`}>
        <p className="text-gray-600">{copy.header.subtitle}</p>
      </div>
            {loadError && (
              <div className="mb-6 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-800 flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{loadError}</span>
              </div>
            )}

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={copy.filters.searchPlaceholder}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500 bg-white"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white"
              >
                <option value="all">{copy.filters.all}</option>
                <option value="active">{copy.filters.active}</option>
                <option value="inactive">{copy.filters.inactive}</option>
              </select>
              <div className="flex items-center justify-end text-sm text-gray-600 px-2">
                {filteredAccessories.length} / {accessories.length}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-300">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {copy.table.image}
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {copy.table.name}
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {copy.table.price}
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {copy.table.minQty}
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {copy.table.status}
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {copy.table.updated}
                      </th>
                      <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {copy.table.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-gray-600">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredAccessories.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-gray-600">
                          No accessories found.
                        </td>
                      </tr>
                    ) : (
                      filteredAccessories.map((a) => (
                        <tr key={a.id} className="hover:bg-amber-50/50">
                          <td className="px-6 py-4">
                            <div className="h-12 w-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={a.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop'}
                                alt={a.nameEn}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{a.nameEn}</div>
                            {a.nameDe && <div className="text-xs text-gray-500">{a.nameDe}</div>}
                          </td>
                          <td className="px-6 py-4 text-gray-800">€{Number(a.price).toFixed(2)}</td>
                          <td className="px-6 py-4 text-gray-800">{a.minQuantity}</td>
                          <td className="px-6 py-4">
                            {a.isActive ? (
                              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-800 border border-green-200">
                                <CheckCircle className="w-4 h-4" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-700 text-sm">
                            {new Date(a.updatedAt).toLocaleDateString(language === 'DE' ? 'de-DE' : 'en-US')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEdit(a)}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                                title="Edit"
                                type="button"
                              >
                                <Edit className="w-4 h-4 text-gray-700" />
                              </button>
                              <button
                                onClick={() => deleteAccessory(a.id)}
                                className="p-2 rounded-lg border border-red-200 hover:bg-red-50"
                                title="Delete"
                                type="button"
                              >
                                <Trash2 className="w-4 h-4 text-red-700" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={closeModal} />
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {form.id ? copy.modal.editTitle : copy.modal.createTitle}
              </h3>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-800">
                    {copy.fields.nameEn} <span className="text-red-600">*</span>
                  </label>
                  <input
                    value={form.nameEn}
                    onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))}
                    className="mt-2 w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800">{copy.fields.nameDe}</label>
                  <input
                    value={form.nameDe}
                    onChange={(e) => setForm((p) => ({ ...p, nameDe: e.target.value }))}
                    className="mt-2 w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">
                    {copy.fields.descEn} <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={form.descriptionEn}
                    onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))}
                    rows={3}
                    className="mt-2 w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">{copy.fields.descDe}</label>
                  <textarea
                    value={form.descriptionDe}
                    onChange={(e) => setForm((p) => ({ ...p, descriptionDe: e.target.value }))}
                    rows={3}
                    className="mt-2 w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">{copy.fields.detailsEn}</label>
                  <textarea
                    value={form.detailsEn}
                    onChange={(e) => setForm((p) => ({ ...p, detailsEn: e.target.value }))}
                    rows={2}
                    className="mt-2 w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">{copy.fields.detailsDe}</label>
                  <textarea
                    value={form.detailsDe}
                    onChange={(e) => setForm((p) => ({ ...p, detailsDe: e.target.value }))}
                    rows={2}
                    className="mt-2 w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800">{copy.fields.unitEn}</label>
                  <input
                    value={form.unitEn}
                    onChange={(e) => setForm((p) => ({ ...p, unitEn: e.target.value }))}
                    className="mt-2 w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800">{copy.fields.unitDe}</label>
                  <input
                    value={form.unitDe}
                    onChange={(e) => setForm((p) => ({ ...p, unitDe: e.target.value }))}
                    className="mt-2 w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800">{copy.fields.price}</label>
                  <input
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    inputMode="decimal"
                    className="mt-2 w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800">{copy.fields.minQuantity}</label>
                  <input
                    value={form.minQuantity}
                    onChange={(e) => setForm((p) => ({ ...p, minQuantity: e.target.value }))}
                    inputMode="numeric"
                    className="mt-2 w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">{copy.fields.image}</label>
                  <input
                    value={form.image}
                    onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                    className="mt-2 w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder:text-gray-500"
                  />
                  {form.image.trim() && (
                    <div className="mt-3 h-44 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.image.trim()} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                    className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-gray-800">
                    {copy.fields.isActive}
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/60">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors"
              >
                {copy.modal.cancel}
              </button>
              <button
                onClick={saveAccessory}
                disabled={saving || !form.nameEn.trim() || !form.descriptionEn.trim()}
                className="px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {copy.modal.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
