"use client";
import AppHeader from "@/app/_components/AppHeader";
import { User, Wheat } from "lucide-react";
import React from "react";
import ExpertsData from "@/public/experts.json";
function page() {
  return (
    <>
      <AppHeader>
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Contact to Expert
              </h1>
            </div>
          </div>
        </div>
      </AppHeader>
      <div className="flex flex-row flex-wrap p-5">
        {ExpertsData.map((user, key) => (
          <div key={user.id} className="w-96 overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center transition-transform hover:scale-105">
            {/* Avatar Circle with Initials */}
            <div  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-2xl font-bold mb-4">
              {user.first_name.charAt(0)}
            </div>

            {/* User Info */}
            <h2 className="text-2xl font-bold text-gray-900">
              {user.first_name}
            </h2>
            <p className="text-lg font-medium text-emerald-600 mb-4">
              {user.Expertise}
            </p>

            {/* Experience Badge */}
            <div className="inline-flex items-center px-5 py-3 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              {user.Experience} Years Experience
            </div>

            {/* Action Button */}
            <button className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors">
              Chat
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default page;
