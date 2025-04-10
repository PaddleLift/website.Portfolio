import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

export const ContactInfo = () => {
  const [contactData, setContactData] = useState({
    call: "",
    WhatsApp: "",
    Email: "",
    Address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(
          "https://paddlelift.onrender.com/components/contact-information/",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch contact information");
        }
        const data = await response.json();
        setContactData(data.contact_information);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <Card className="bg-black/40 border-neutral-800 backdrop-blur-sm h-full">
        <CardHeader>
          <CardTitle className="text-neutral-200">
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-400">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-black/40 border-neutral-800 backdrop-blur-sm h-full">
        <CardHeader>
          <CardTitle className="text-neutral-200">
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-400">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-neutral-800 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="text-neutral-200">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <Phone className="w-5 h-5 mr-2 text-neutral-400" />
          <p className="text-neutral-400">
            Call or WhatsApp: +91-{contactData.call}
          </p>
        </div>
        <div className="flex items-center">
          <Mail className="w-5 h-5 mr-2 text-neutral-400" />
          <p className="text-neutral-400">Email Us: {contactData.Email}</p>
        </div>
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-neutral-400" />
          <p className="text-neutral-400">{contactData.Address}</p>
        </div>
      </CardContent>
      <CardHeader>
        <CardTitle className="text-neutral-200">Our Location</CardTitle>
      </CardHeader>
      <CardContent className="h-[460px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.4725137946443!2d77.36948895194043!3d28.61559722233175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce59d969ba857%3A0x9a234478868502b9!2sPaddleLift%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1734004896279!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{
            border: 0,
            borderRadius: "0.5rem",
            filter: "invert(90%) hue-rotate(180deg)",
          }}
          allowFullScreen
          loading="lazy"
        />
      </CardContent>
    </Card>
  );
};
