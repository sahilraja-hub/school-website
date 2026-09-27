import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  Shield,
  MessageSquare,
} from 'lucide-react';
import {
  Breadcrumb,
  Card,
  CardContent,
  Badge,
  Input,
  Textarea,
  Button,
  useToast,
} from '../../components/ui';
import { SEO } from '../../components/common/SEO';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Admissions Office',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      type: 'success',
      title: 'Inquiry Dispatched',
      message: 'Thank you for reaching out. An admissions counselor will respond within 24 business hours.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="Contact Campus — Admissions & Inquiries"
        description="Connect with Oakridge International Academy. Find campus directions, administrative direct lines, office hours, and book private campus walkthroughs."
        keywords="Contact Oakridge Academy, campus visit, admissions office phone, school directions Cambridge"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Contact & Campus Visit' },
          ]}
        />

        {/* Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-crest-950 text-white p-8 sm:p-12 border border-crest-900 shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="gold" size="sm">Get In Touch</Badge>
              <Badge variant="outline" size="sm" className="text-crest-200 border-crest-700">
                Cambridge Campus
              </Badge>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              We Welcome Your Inquiries
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Whether you are an inquiring prospective family, alumni returning to grounds, or an academic partner, our administrative teams are here to assist you.
            </p>
          </div>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Office Cards */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-6 border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-crest-100 text-crest-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">Campus Address</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                450 Academy Way, Cambridge Campus<br />
                Seattle, WA 98101, United States
              </p>
              <p className="text-[11px] text-slate-400">Visitors must check in at Founder’s Hall Reception Desk.</p>
            </Card>

            <Card className="p-6 border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">Telephone Direct Lines</h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li><strong className="text-slate-800">Admissions Desk:</strong> +1 (800) 555-OAKRIDGE</li>
                <li><strong className="text-slate-800">Office of the Registrar:</strong> +1 (555) 019-2810</li>
                <li><strong className="text-slate-800">Head of School Suite:</strong> +1 (555) 019-2801</li>
                <li><strong className="text-slate-800">Health Clinic (Urgent):</strong> +1 (555) 019-2890</li>
              </ul>
            </Card>

            <Card className="p-6 border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">Reception & Office Hours</h3>
              <p className="text-xs text-slate-600">
                Monday through Friday: 8:00 AM – 4:30 PM PST<br />
                Saturday Campus Tours (Reservation Only): 9:30 AM & 1:00 PM<br />
                Sunday: Closed for Campus Maintenance
              </p>
            </Card>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card space-y-6">
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <Badge variant="primary" size="sm">Electronic Inquiry Form</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Send a Direct Message to Admissions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Fill out the form below and an academic counselor will reply within 24 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">Inquiry Received</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for connecting with Oakridge International Academy. A formal confirmation and prospective scholar package has been dispatched to <strong>{formData.email}</strong>.
                </p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Submit Another Inquiry
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Full Name"
                    placeholder="e.g. Katherine Sterling"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="k.sterling@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-semibold text-slate-700">
                      Department of Interest
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-crest-500 focus:border-crest-500"
                    >
                      <option value="Admissions Office">Admissions Office (Candidate Applications)</option>
                      <option value="Office of the Registrar">Office of the Registrar (Records & Transcripts)</option>
                      <option value="Principal's Office">Office of the Head of School</option>
                      <option value="Athletics Department">Athletics & Summer Camps</option>
                    </select>
                  </div>
                </div>

                <Textarea
                  label="Inquiry or Message Details"
                  placeholder="Tell us about your student's current grade, academic interests, or your requested tour date..."
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  helperText="All inquiries are treated with strict confidentiality."
                />

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={submitting}
                  className="w-full sm:w-auto"
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Send Inquiry to Admissions
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
