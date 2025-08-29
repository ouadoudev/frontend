import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubjects } from "@/store/subjectSlice";
import { subscribeToSubjects } from "@/store/subscriptionSlice";
import { useNavigate } from "react-router-dom";
import { loggedUser } from "@/store/authSlice";

export default function Subscribe() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  const { entities: subjects = [], loading: subjectsLoading, error: subjectsError } = useSelector(
    (state) => state.subjects
  );
  const { loading: subscriptionsLoading } = useSelector(
    (state) => state.subscription
  );
  const user = useSelector(loggedUser);

  const { educationalLevel } = user || {};

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleCheckboxChange = (subjectId) => {
    setSelectedSubjectIds((prevSelected) =>
      prevSelected.includes(subjectId)
        ? prevSelected.filter((id) => id !== subjectId)
        : [...prevSelected, subjectId]
    );
  };

  const updateLocalStorageWithEnrolledSubjects = (selectedIds) => {
    const existingUserData = JSON.parse(localStorage.getItem('user'));
    const existingEnrolledSubjects = existingUserData?.enrolledSubjects || [];
    const newlySelectedSubjects = subjects.filter((subject) =>
      selectedIds.includes(subject._id)
    );
  
    const combinedEnrolledSubjects = [
      ...existingEnrolledSubjects,
      ...newlySelectedSubjects.filter(
        (newSubject) => !existingEnrolledSubjects.some(
          (existing) => existing._id === newSubject._id
        )
      ),
    ];
  
    const updatedUserData = { ...user, enrolledSubjects: combinedEnrolledSubjects };
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };
  
  const handleSubscribe = () => {
    if (selectedSubjectIds.length > 0) {
      dispatch(subscribeToSubjects(selectedSubjectIds)).then((response) => {
        if (!response.error) {
          updateLocalStorageWithEnrolledSubjects(selectedSubjectIds);
          navigate('/profile');
        }
      });
      setSelectedSubjectIds([]);
    }
  };

  const filteredSubjects = subjects.filter(
    (subject) => subject.educationalLevel === educationalLevel
  );

  const totalPrice = filteredSubjects
    .filter((subject) => selectedSubjectIds.includes(subject._id))
    .reduce((acc, subject) => acc + subject.price, 0);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subjects Subscription</h1>
          <p>Select subjects to subscribe to.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" size="lg" onClick={handleSubscribe} disabled={subscriptionsLoading}>
            {subscriptionsLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>
      </div>

      {subjectsLoading && <p>Loading subjects...</p>}
      {subjectsError && <p>Error: {subjectsError}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <Card key={subject._id} className="relative group">
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{subject.title}</h3>
                <input
                  type="checkbox"
                  checked={selectedSubjectIds.includes(subject._id)}
                  onChange={() => handleCheckboxChange(subject._id)}
                />
              </div>
              <p className="text-muted-foreground">{subject.description.length > 120
                  ? `${subject.description.substring(0, 110)}...`
                  : subject.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{subject.duration}</span>
                <span className="text-primary font-medium">${subject.price}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 md:mt-12">
        <Separator />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Total</h2>
            <p>All selected subjects in your subscription</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-3xl font-bold">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
