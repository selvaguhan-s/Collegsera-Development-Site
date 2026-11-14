import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { saveUserData } from "@/services/userService";
import { X, ArrowRight } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  // If children are provided, render them, otherwise render default form
  children?: React.ReactNode;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    course: "",
    city: "",
  });
  const [isAgreed, setIsAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) {
      setError("Please agree to the Terms and Conditions to proceed.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      await saveUserData({
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        course: formData.course.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          name: "",
          phone_number: "",
          email: "",
          course: "",
          city: "",
        });
        setIsAgreed(true);
      }, 2000);
    } catch (err) {
      setError("Failed to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto border border-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700 z-10 p-1.5 bg-white/80 hover:bg-slate-100 rounded-full transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {children ? (
          <div className="p-6">{children}</div>
        ) : (
          <div className="flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-50 via-amber-50/40 to-white px-6 py-5 border-b border-orange-100/80 text-center">
              <img
                src="/CollegeseraLogo.png"
                alt="CollegeSera"
                className="h-9 mx-auto mb-2"
              />
              <h3 className="text-xl font-extrabold text-slate-900">
                Book Your Seat Now!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Personalized admission guidance from our experts
              </p>
            </div>

            {/* Form */}
            <div className="p-6 bg-white">
              {success ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Success!</h4>
                  <p className="text-sm text-slate-600">
                    We will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
                    >
                      Full Name <span className="text-orange-600">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-10 bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone_number"
                      className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
                    >
                      Mobile Number <span className="text-orange-600">*</span>
                    </Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                      className="h-10 bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
                    >
                      Email Address <span className="text-orange-600">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-10 bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="course"
                        className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
                      >
                        Course <span className="text-orange-600">*</span>
                      </Label>
                      <Input
                        id="course"
                        placeholder="e.g. B.Tech, MBA"
                        value={formData.course}
                        onChange={handleChange}
                        required
                        className="h-10 bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="city"
                        className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
                      >
                        City <span className="text-orange-600">*</span>
                      </Label>
                      <Input
                        id="city"
                        placeholder="e.g. Chennai"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="h-10 bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-1">
                    <Checkbox
                      id="booking-terms"
                      checked={isAgreed}
                      onCheckedChange={(checked) =>
                        setIsAgreed(checked as boolean)
                      }
                      className="mt-0.5 bg-white border-slate-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                    />
                    <Label
                      htmlFor="booking-terms"
                      className="text-xs text-slate-600 leading-snug cursor-pointer font-normal"
                    >
                      By submitting this form, I agree to the{" "}
                      <span className="text-orange-600 font-semibold">
                        Terms and Conditions
                      </span>{" "}
                      and{" "}
                      <span className="text-orange-600 font-semibold">
                        Privacy Policy
                      </span>
                      .
                    </Label>
                  </div>

                  {error && (
                    <p className="text-red-600 text-xs text-center font-medium bg-red-50 border border-red-200 p-2 rounded-xl">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="group w-full h-11 bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 hover:from-orange-600 hover:via-orange-600 hover:to-red-600 text-white font-bold mt-2 rounded-xl shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    <span>
                      {isSubmitting ? "Submitting..." : "Book Counselling Slot"}
                    </span>
                    {!isSubmitting && (
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default BookingModal;
