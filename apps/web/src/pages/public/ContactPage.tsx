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
      message: 'Thank you for reaching out to R.B.S. Residential Public School. Our admissions team will respond shortly.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="Contact Us — R.B.S Residential Public School, Mahua, Vaishali"
        description="Get in touch with R.B.S. Residential Public School, Mahua, Vaishali, Bihar 844122. Campus address, telephone direct lines, admission desk (+91 70503 49159), and interactive Google map."
        keywords="Contact RBS School Mahua, RBSRPS Vaishali phone number, RBS Public School address, CBSE school Mahua contact"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Contact Us' },
          ]}
        />

        {/* Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-crest-950 text-white p-8 sm:p-12 border border-crest-900 shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="gold" size="sm">Get In Touch</Badge>
              <Badge variant="outline" size="sm" className="text-crest-200 border-crest-700">
                Mahua Campus, Vaishali
              </Badge>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              We Welcome Your Questions & Visits
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Whether you are seeking admission for the upcoming academic session, inquiring about hostel and transport services, or seeking guidance from our academic office, our administrative staff is at your service.
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
                <strong>R.B.S Residential Public School</strong><br />
                Ababakarpur Kowahi - Mukundpur - Mahua Rd,<br />
                Mahua Ram Rae, Vaishali, Bihar – 844122<br />
                (Patepur Road, Mahua)
              </p>
              <p className="text-[11px] text-slate-400">Visitors are welcome at the Administrative Office Reception Desk.</p>
            </Card>

            <Card className="p-6 border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">Direct Telephone Hotlines</h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li><strong className="text-slate-800">Admissions & Help Desk:</strong> +91 70503 49159</li>
                <li><strong className="text-slate-800">Administrative Office:</strong> +91 9199678159</li>
                <li><strong className="text-slate-800">Hostel & Boarding Wardens:</strong> +91 70503 49159</li>
                <li><strong className="text-slate-800">Email:</strong> info@rbsschool.com / info@rbsschool.in</li>
              </ul>
            </Card>

            <Card className="p-6 border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">School Office Hours</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monday to Saturday: 8:00 AM – 4:00 PM IST<br />
                Principal Consultation Hours: 10:00 AM – 1:00 PM<br />
                Sunday: Closed for Campus Maintenance
              </p>
            </Card>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card space-y-6">
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <Badge variant="primary" size="sm">Electronic Inquiry Form</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Send a Message to Our Admissions Desk
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Fill out the form below and an academic counselor will connect with you via phone or email.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">Inquiry Received Successfully</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out to R.B.S. Residential Public School, Mahua. Our admissions team has registered your query and will contact <strong>{formData.phone || formData.email}</strong>.
                </p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Parent / Student Full Name"
                    placeholder="e.g. Ramesh Kumar"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Contact Phone Number"
                    type="tel"
                    placeholder="+91 98765 43210"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="parent@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-semibold text-slate-700">
                      Inquiry Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-crest-500 focus:border-crest-500"
                    >
                      <option value="Admissions Office">New Admissions (Pre-Primary to 12th)</option>
                      <option value="Hostel & Boarding">Hostel / Residential Boarding</option>
                      <option value="Transport Department">School Bus & Transport Service</option>
                      <option value="Office of the Principal">Principal's Office</option>
                      <option value="Accounts & Fees">Fee Counter & Accounts</option>
                    </select>
                  </div>
                </div>

                <Textarea
                  label="Inquiry / Message Details"
                  placeholder="Specify the class for admission, student's previous school, hostel requirement, or any query..."
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  helperText="Your personal details will remain strictly confidential."
                />

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={submitting}
                  className="w-full sm:w-auto"
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Submit Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Embedded Interactive Google Map */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Campus Location on Google Maps</h3>
              <p className="text-xs text-slate-500">
                Patepur Road, Mahua Ram Rae, Vaishali, Bihar – 844122
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=R.B.S.+Residential+Public+School+Mahua+Vaishali"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-crest-700 hover:text-crest-900 flex items-center gap-1"
            >
              <MapPin className="w-4 h-4" /> Open in Google Maps
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 h-80 sm:h-96 w-full">
            <iframe
              title="R.B.S. Residential Public School Campus Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14365.514279933417!2d85.4049548!3d25.824068!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xbda04015f692db63!2sR.B.S.%20Residential%20Public%20School!5e0!3m2!1sen!2sin!4v1670170742078!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
