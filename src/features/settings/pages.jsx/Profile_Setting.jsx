// features/settings/pages/ProfileSettings.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Camera, Building } from "lucide-react";

const PROFILE_SECTIONS = [
  {
    id: "personal",
    icon: User,
    title: "Personal Information",
    description: "Update your name and contact details",
  },
  {
    id: "email",
    icon: Mail,
    title: "Email Address",
    description: "Manage your email and preferences",
  },
  {
    id: "avatar",
    icon: Camera,
    title: "Profile Picture",
    description: "Upload or change your avatar",
  },
  {
    id: "company",
    icon: Building,
    title: "Company Details",
    description: "Update your organization information",
  },
];

function SectionCard({ section }) {
  const Icon = section.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-violet-200 hover:shadow-sm transition-all">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{section.description}</p>
          
          <div className="space-y-3">
            <div className="h-10 bg-gray-50 rounded-lg border border-dashed border-gray-200" />
            <div className="h-10 bg-gray-50 rounded-lg border border-dashed border-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileSettings() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-500">Manage your personal information</p>
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="grid gap-4">
        {PROFILE_SECTIONS.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SectionCard section={section} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}