import React, { useEffect, useState } from "react";
import { doc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { Button } from "../components/ui/button";

const UserDetailModal = ({ user, onClose }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  if (!user) return null;

  const {
    profileName,
    possessedSkills = [],
    skillsToLearn = [],
    description = "No description available.",
    country = "Unknown",
    languages = [],
    profilePictureUrl = "/assets/default1.png",
    id: uid,
  } = user;

  useEffect(() => {
    console.log("User object received:", user);
    console.log("User UID:", uid);
  
    const fetchUserRating = async () => {
        try {
          if (!uid) {
            console.warn("No user ID provided");
            return;
          }
      
          const ratingsRef = collection(doc(db, "users", uid), "ratings");
          const snapshot = await getDocs(ratingsRef);
      
          console.log("Ratings snapshot:", snapshot); // Log full snapshot for inspection
      
          if (snapshot.empty) {
            console.log("No ratings found for user:", uid);
            return;
          }
      
          // Log each document to check their structure
          snapshot.docs.forEach((doc) => console.log("Rating Document:", doc.data()));
      
          const ratings = snapshot.docs.map((doc) => doc.data().rating);
      
          if (ratings.length === 0) {
            console.warn("No valid ratings found.");
            return;
          }
      
          // Calculate the average rating
          const total = ratings.reduce((acc, val) => acc + val, 0);
          setAverageRating((total / ratings.length).toFixed(1));
          setRatingCount(ratings.length);
        } catch (error) {
          console.error("Error fetching ratings:", error);
        }
      };
      
  
    fetchUserRating();
  }, [uid]);
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center mb-4">
          <img
            src={profilePictureUrl}
            alt={profileName}
            className="w-16 h-16 rounded-full mr-4"
          />
          <h2 className="text-2xl font-semibold">{profileName}</h2>
        </div>

        <p className="mb-4 text-sm">{description}</p>

        <div className="mb-4">
          <h3 className="text-lg text-teal-400 font-semibold mb-2">
            Skills Possessed:
          </h3>
          <div className="flex flex-wrap gap-2">
            {possessedSkills.length > 0 ? (
              possessedSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-teal-500 px-3 py-1 rounded-lg text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p>No skills listed.</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg text-teal-400 font-semibold mb-2">
            Skills to Learn:
          </h3>
          <div className="flex flex-wrap gap-2">
            {skillsToLearn.length > 0 ? (
              skillsToLearn.map((skill, index) => (
                <span
                  key={index}
                  className="bg-purple-500 px-3 py-1 rounded-lg text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p>No learning goals specified.</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg text-teal-400 font-semibold">Country:</h3>
          <p>{country}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg text-teal-400 font-semibold">Languages:</h3>
          <p>{languages.length > 0 ? languages.join(", ") : "Not specified"}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg text-teal-400 font-semibold">Rating:</h3>
          {ratingCount > 0 ? (
            <p>{averageRating} ⭐ ({ratingCount} Ratings)</p>
          ) : (
            <p>No ratings yet</p>
          )}
        </div>

        <Button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white mt-4"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default UserDetailModal;
