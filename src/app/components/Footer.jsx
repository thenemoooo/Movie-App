import Link from "next/link";
import { Film, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#4338CA] text-white py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="space-y-3 shrink-0">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg italic text-white">
            <Film className="w-5 h-5 text-white" />
            Movie Z
          </Link>
          <p className="text-xs text-white/80">
            © 2024 Movie Z. All Rights Reserved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-12 lg:gap-20 text-xs">
          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-normal text-white/90">Contact Information</h3>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Email:</p>
                <a href="mailto:support@movieZ.com" className="text-white/90 hover:underline">
                  support@movieZ.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <Phone className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Phone:</p>
                <p className="text-white/90">+976 (11) 123-4567</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-normal text-white/90">Follow us</h3>
            <div className="flex items-center gap-4 font-semibold text-white">
              <a href="#" className="hover:underline">Facebook</a>
              <a href="#" className="hover:underline">Instagram</a>
              <a href="#" className="hover:underline">Twitter</a>
              <a href="#" className="hover:underline">Youtube</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}