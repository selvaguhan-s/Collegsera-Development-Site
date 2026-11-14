import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { saveUserData } from "@/services/userService";
import {
  User,
  Phone,
  Mail,
  GraduationCap,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_COURSES = [
  "B.E / B.Tech",
  "MBA",
  "B.Sc Nursing",
  "Arts & Science",
  "Paramedical",
];

const UserForm = ({ isOpen, onClose }: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    course: "",
    city: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAgreed, setIsAgreed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (error) setError(null);
  };

  const handleCourseChipClick = (courseName: string) => {
    setFormData((prev) => ({
      ...prev,
      course: courseName,
    }));
    if (error) setError(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone_number: "",
      email: "",
      course: "",
      city: "",
    });
    setIsAgreed(true);
    setError(null);
    setIsSubmitted(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setTimeout(resetForm, 200);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) {
      setError("Please agree to the Terms and Conditions to proceed.");
      return;
    }

    const cleanedPhone = formData.phone_number.replace(/\D/g, "").slice(-10);
    if (cleanedPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await saveUserData({
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim(),
        email: formData.email.trim(),
        course: formData.course.trim(),
        city: formData.city.trim(),
      });

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Failed to save user data:", err);
      setError(
        err?.message || "Failed to submit the form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="
          w-[94vw]
          sm:max-w-[510px]
          max-h-[92vh]
          overflow-y-auto
          bg-white
          text-slate-900
          p-0
          rounded-2xl
          shadow-[0_25px_65px_-15px_rgba(15,23,42,0.3)]
          border border-slate-100
          gap-0
        "
      >
        {/* MODERN HEADER */}
        <div className="relative bg-gradient-to-br from-orange-50 via-amber-50/50 to-white px-6 pt-5 pb-4 border-b border-orange-100/80 overflow-hidden">
          <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full bg-orange-300/20 blur-2xl" />

          <DialogHeader className="relative z-10 text-left sm:text-left space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Get Expert Guidance
              </DialogTitle>
              <img
                src="/CollegeseraLogo.png"
                className="h-8 w-auto object-contain mr-6"
                alt="CollegeSera Logo"
              />
            </div>

            <DialogDescription className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Share your preferences and our admission experts will help you shortlist the right college, fees & scholarships.
            </DialogDescription>

            {/* Trust badges without Free context */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2.5 mt-1 border-t border-orange-200/40 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Verified Fee & Cutoff Data
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Personalized Shortlist
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Quick Callback
              </span>
            </div>
          </DialogHeader>
        </div>

        {/* FORM BODY - HIGH-CONTRAST LIGHT SURFACE */}
        <div className="bg-white px-6 py-5">
          {isSubmitted ? (
            <div className="py-6 text-center space-y-3.5 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">
                  Request Received!
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-slate-900">{formData.name}</span>. Our admission counselor will contact you shortly on{" "}
                  <span className="font-semibold text-slate-900">{formData.phone_number}</span>.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                <Button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 h-10 text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/20"
                >
                  Done
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 h-10 text-xs sm:text-sm rounded-xl"
                >
                  Submit Another Response
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Full Name <span className="text-orange-600">*</span>
                  </Label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="name"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-10 pl-9 text-sm rounded-xl bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal border-slate-200 hover:border-slate-300 focus-visible:bg-white focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/15 caret-orange-600 shadow-sm transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone_number"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Mobile Number <span className="text-orange-600">*</span>
                  </Label>
                  <div className="relative flex items-center">
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80 select-none pointer-events-none">
                      <Phone className="w-3 h-3 text-orange-500" />
                      +91
                    </div>
                    <Input
                      id="phone_number"
                      type="tel"
                      placeholder="98765 43210"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                      className="h-10 pl-16 text-sm rounded-xl bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal border-slate-200 hover:border-slate-300 focus-visible:bg-white focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/15 caret-orange-600 shadow-sm transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Email Address <span className="text-orange-600">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-10 pl-9 text-sm rounded-xl bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal border-slate-200 hover:border-slate-300 focus-visible:bg-white focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/15 caret-orange-600 shadow-sm transition-all"
                    />
                  </div>
                </div>

                {/* Preferred City */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="city"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Preferred City <span className="text-orange-600">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="city"
                      placeholder="Coimbatore, Chennai..."
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="h-10 pl-9 text-sm rounded-xl bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal border-slate-200 hover:border-slate-300 focus-visible:bg-white focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/15 caret-orange-600 shadow-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Course of Interest + Quick Select Chips */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="course"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Course of Interest <span className="text-orange-600">*</span>
                </Label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="course"
                    placeholder="Type or select a course below (e.g. B.Tech, MBA)"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="h-10 pl-9 text-sm rounded-xl bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal border-slate-200 hover:border-slate-300 focus-visible:bg-white focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/15 caret-orange-600 shadow-sm transition-all"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-medium text-slate-400 mr-0.5">
                    Popular:
                  </span>
                  {POPULAR_COURSES.map((courseName) => {
                    const isSelected =
                      formData.course.toLowerCase() === courseName.toLowerCase();
                    return (
                      <button
                        key={courseName}
                        type="button"
                        onClick={() => handleCourseChipClick(courseName)}
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium border transition-all ${
                          isSelected
                            ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-300 hover:bg-orange-50/60 hover:text-orange-700"
                        }`}
                      >
                        {courseName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 bg-slate-50/80 px-3 py-2.5 rounded-xl border border-slate-100">
                <Checkbox
                  id="terms"
                  checked={isAgreed}
                  onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
                  className="mt-0.5 border-slate-300 bg-white data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                />
                <Label
                  htmlFor="terms"
                  className="text-xs text-slate-600 leading-snug cursor-pointer font-normal"
                >
                  I agree to receive admission updates and accept the{" "}
                  <a
                    href="/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 font-semibold hover:underline"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 font-semibold hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </Label>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200/80 px-3 py-2 rounded-xl text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-1 space-y-2">
                <Button
                  type="submit"
                  className="
                    group
                    relative
                    overflow-hidden
                    w-full
                    h-11
                    bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600
                    hover:from-orange-600 hover:via-orange-600 hover:to-red-600
                    text-white
                    font-bold
                    text-sm
                    rounded-xl
                    shadow-md shadow-orange-500/25
                    hover:shadow-lg hover:shadow-orange-500/40
                    hover:-translate-y-0.5
                    active:translate-y-0
                    transition-all duration-300
                    flex items-center justify-center gap-2
                  "
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting Details...
                    </>
                  ) : (
                    <>
                      <span>Get Expert Guidance</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Your details are 100% private and never spammed</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
