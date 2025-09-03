import React, { useState, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProgress } from "@/store/badgeSlice";
import { ScrollArea } from "../ui/scroll-area";

export function AchievementsCard({ user }) {
  const dispatch = useDispatch();
  const { userProgress = [], loading } = useSelector((state) => state.badges);

  const [currentQuote, setCurrentQuote] = useState(0);

const motivationalQuotes = [
  "طلب العلم فريضة على كل مسلم، فابدأ اليوم ولا تؤجل أي لحظة من حياتك.",
  "The only way to achieve the impossible is to believe in the possibility of it.",
  "Savoir, c’est pouvoir ; chaque connaissance est une clé pour ton avenir.",

  "من سلك طريق العلم سهّل الله له طريق الجنة وفتح له أبواب الرزق.",
  "Success comes from hard work, perseverance, learning, and love for what you do.",
  "Il n’est jamais trop tard pour apprendre et améliorer sa vie chaque jour.",

  "العلم يرفعك فوق الآخرين، فاستثمر وقتك في التعلم والتفكير باستمرار.",
  "You don’t have to be great to start, but you must start to become great.",
  "Apprendre sans réfléchir est vain ; réfléchis et chaque pas compte.",

  "هل يستوي الذين يعلمون والذين لا يعلمون؟ اجعل لنفسك مكانًا بينهم.",
  "The best way to predict your future is to create it step by step today.",
  "Petit à petit, l’oiseau fait son nid, la patience mène à la réussite.",

  "خيركم من تعلم العلم وعلمه للآخرين بفائدة وصبر وصدق نية.",
  "A little progress each day leads to results far greater than expected.",
  "L’éducation est l’arme la plus puissante pour transformer le monde.",

  "العلم نور، والجهل ظلام، فاختر طريق النور وابتعد عن كل ضلال.",
  "Procrastination makes simple tasks hard and difficult tasks even harder.",
  "On n’arrête pas le progrès ; chaque effort nous rapproche de l’objectif.",

  "اطلب العلم من المهد إلى اللحد، فكل يوم هو فرصة للتعلم والنمو.",
  "Education is the passport to the future for those who prepare today.",
  "La curiosité est le commencement de la sagesse et du savoir infini.",

  "العلم بلا عمل كالنبع بلا ماء، فطبقه وطبّع حياتك بالمعرفة.",
  "The harder you work, the greater satisfaction you feel when you succeed.",
  "Celui qui veut apprendre trouvera toujours un maître pour le guider.",

  "تعلم اليوم لتصنع مستقبلك غدًا بجد واجتهاد وإصرار على النجاح.",
  "There are no shortcuts to any place that is truly worth reaching.",
  "L’expérience est la somme de nos erreurs et des leçons que nous tirons.",

  "كل دقيقة تقضيها في التعلم ترفع درجاتك في الدنيا والآخرة.",
  "Failure is the chance to start again smarter and more prepared than before.",
  "Qui veut faire quelque chose trouve un moyen, qui ne veut rien fait excuse.",

  "العلم زينة في الدنيا ونجاة في الآخرة لمن استثمر وقته بحكمة.",
  "Your grades do not define your intelligence nor limit your future success.",
  "La connaissance est la clé de la liberté et ouvre toutes les portes."
];


  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProgress(user.id));
    }

    // Rotate quotes every 10 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 10000);

    return () => clearInterval(quoteInterval);
  }, [dispatch, user?.id]);

  if (loading) {
    return (
      <div className="relative">
        <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100 shadow-xl">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Your Learning Adventure
              </h2>
              <p className="text-muted-foreground mt-1">
                Level up your knowledge!
              </p>
            </div>
            <div className="animate-pulse">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-12 bg-gray-200 rounded mt-2"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded mt-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100 shadow-xl">
        <div className="space-y-6">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Mes Challenges
          </CardTitle>
          <ScrollArea className="h-96 px-1">
            <div className="space-y-3">
              {userProgress.map((item) => (
                <div
                  key={item.badge.badgeId}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    item.meetsConditions
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{item.badge.name}</h4>
                    </div>
                    <Badge
                      variant={item.meetsConditions ? "default" : "secondary"}
                    >
                      +{item.badge.points} LP
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={item.progress.percentage}
                      className="flex-1 h-2"
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.progress.metConditions}/
                      {item.progress.totalConditions}
                    </span>
                    {item.meetsConditions && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside">
                    {item.progress.conditionDetails.map((cond, idx) => (
                      <li
                        key={idx}
                        className={cond.met ? "text-green-600" : ""}
                      >
                        {cond.description}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>
          {/* Motivational Quote */}
          <div className="text-center p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
            <div
              className="text-lg min-h-16 font-medium text-purple-800 transition-all duration-500"
              dir={getDirection(motivationalQuotes[currentQuote])}
            >
              {motivationalQuotes[currentQuote]}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
