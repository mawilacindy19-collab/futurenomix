'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, FileText, FileCheck, Building, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CreateOpportunityPage() {
  const router = useRouter();
  const [category, setCategory] = useState('Suppliers');
  const [oppTitle, setOppTitle] = useState('');
  const [oppDescription, setOppDescription] = useState('');
  const [oppBudget, setOppBudget] = useState('R50,000');
  const [pdfFile, setPdfFile] = useState<{ name: string; dataUrl: string } | null>(null);
  const [imageFile, setImageFile] = useState<{ name: string; dataUrl: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPdfFile({
          name: file.name,
          dataUrl: uploadEvent.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImageFile({
          name: file.name,
          dataUrl: uploadEvent.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTitle.trim()) return;

    const stored = localStorage.getItem('business_opportunities');
    let parsed: any[] = [];
    try {
      if (stored) parsed = JSON.parse(stored);
    } catch (e) {
      parsed = [];
    }
    const newOpp = {
      id: Date.now().toString(),
      category,
      title: oppTitle,
      description: oppDescription,
      budget: oppBudget,
      date: 'Just now',
      pdfName: pdfFile?.name || 'Proposal_Document.pdf',
      pdfDataUrl: pdfFile?.dataUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      imageUrl: imageFile?.dataUrl || ''
    };
    parsed.unshift(newOpp);
    localStorage.setItem('business_opportunities', JSON.stringify(parsed));

    const routeMap: Record<string, string> = {
      'Suppliers': 'supplier',
      'B2B Demand': 'demand',
      'Partnership': 'partnership'
    };
    router.push(`/businesses/${routeMap[category] || 'supplier'}`);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      {/* Header Bar */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/businesses" className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-xs font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Business Hub</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Building className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-sm">Commercial Alliance Portal</span>
        </div>
      </header>

      {/* Main Form Content - Full Page Solid Background */}
      <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-xl overflow-hidden p-8">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Plus className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-display font-bold">Create Business Opportunity</h1>
            <p className="text-sm text-muted-foreground mt-1">Broadcast procurement lists, supplier requests, or joint-venture partnerships to the global network.</p>
          </div>

          <form onSubmit={handleCreateOpportunity} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Suppliers">Suppliers</option>
                <option value="B2B Demand">B2B Demand</option>
                <option value="Partnership">Partnership</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Opportunity Title</label>
              <input 
                type="text" 
                required 
                value={oppTitle}
                onChange={e => setOppTitle(e.target.value)}
                placeholder="e.g. ISO-Certified Lithium-Ion Battery Suppliers Needed"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Estimated Budget / Contract Value</label>
              <input 
                type="text" 
                value={oppBudget}
                onChange={e => setOppBudget(e.target.value)}
                placeholder="R150,000"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description & Requirements</label>
              <textarea 
                rows={4}
                value={oppDescription}
                onChange={e => setOppDescription(e.target.value)}
                placeholder="Provide details about volume, specifications, timeline, or partnership objectives..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Business Card / Banner Photo</label>
              <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary transition-colors bg-muted/20">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden" 
                  id="fullpage-image-upload"
                />
                <label htmlFor="fullpage-image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  {imageFile ? (
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                      <FileCheck className="w-4 h-4" />
                      <span>{imageFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium">Click to upload business card photo</span>
                      <span className="text-xs text-muted-foreground">PNG, JPG or WEBP up to 10MB</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Attach Specification PDF</label>
              <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary transition-colors bg-muted/20">
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden" 
                  id="fullpage-pdf-upload"
                />
                <label htmlFor="fullpage-pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  {pdfFile ? (
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                      <FileCheck className="w-4 h-4" />
                      <span>{pdfFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium">Click to upload specification PDF</span>
                      <span className="text-xs text-muted-foreground">PDF documents up to 25MB</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
              <Link 
                href="/businesses"
                className="px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md"
              >
                Publish Opportunity
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
