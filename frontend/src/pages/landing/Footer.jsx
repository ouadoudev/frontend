import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { fetchUsers } from "@/store/userSlice";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const Footer = () => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.user);

  const fondateur = users.find((user) => user.role === "admin");

  useEffect(() => {
    if (status === "idle") dispatch(fetchUsers());
  }, [dispatch, status]);

  return (
    <footer
      className="relative w-full bg-gradient-to-br from-slate-950 via-slate-700 to-slate-950 text-white overflow-hidden"
      aria-label="Pied de page Tamadrus"
    >
      {/* Fond décoratif */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6 py-8">
        <div className="grid gap-16 lg:grid-cols-2 mb-8">
          {/* Bloc À propos + Mission */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/tamadrus_logo.png"
                  className="h-12 mb-3"
                  alt="tamadrus logo"
                />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Tamadrus
                </h3>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">
                  À Propos de Tamadrus
                </h4>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Tamadrus est la plateforme éducative en ligne conçue pour les
                  élèves marocains, du primaire au baccalauréat. Nos cours
                  interactifs, conformes aux programmes du Ministère de
                  l’Éducation Nationale, sont dispensés par des enseignants
                  qualifiés et disponibles en français et en arabe. Nous aidons
                  chaque élève à progresser en maths, en français, en
                  physique-chimie et dans toutes les matières du cursus scolaire
                  marocain.
                </p>

                <h4 className="text-lg font-semibold text-white">
                  Notre Mission
                </h4>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Rendre une éducation de qualité accessible à tous les élèves
                  au Maroc — y compris en zone rurale. Grâce à une technologie
                  éducative simple et efficace, combinée à une pédagogie adaptée
                  au contexte marocain, Tamadrus permet à chaque enfant
                  d’apprendre à son rythme, de combler ses lacunes et de réussir
                  ses examens, du contrôle continu au baccalauréat.
                </p>
              </div>
            </div>
          </div>

          {/* Bloc Fondateur */}
          {fondateur && (
            <address className="flex flex-col items-center text-center space-y-4 not-italic">
              <Avatar className="h-24 w-24 ring-2 ring-gradient-to-r from-blue-600 to-purple-600 ring-offset-2 ring-offset-slate-900">
                <AvatarImage
                  src={fondateur.user_image?.url || "/placeholder.svg"}
                  alt={`Photo de ${fondateur.username}, Fondateur de Tamadrus`}
                  loading="lazy"
                  className="object-cover"
                />
                <AvatarFallback className="text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {fondateur.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h5 className="text-lg font-bold text-white mb-1">
                  {fondateur.username}
                </h5>
                <p className="text-blue-400 text-sm font-medium mb-2">
                  Fondateur & CEO
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {fondateur.bio}
                </p>
              </div>
            </address>
          )}
        </div>

        {/* Bas de page */}
        <div className="border-t border-slate-700/50 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0">
            <nav
              className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6"
              aria-label="Liens légaux"
            >
              <p className="text-slate-400 text-sm">
                © 2025 Tamadrus. Tous droits réservés.
              </p>
              <div className="flex space-x-6 text-sm">
                <Link
                  to="/"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Politique de confidentialité
                </Link>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Conditions d’utilisation
                </Link>
              </div>
            </nav>

            {/* Réseaux sociaux */}
            <div className="flex space-x-4" aria-label="Réseaux sociaux">
              <a
                className="group flex items-center justify-center w-12 h-12 bg-slate-800/50 hover:bg-blue-600 rounded-xl border border-slate-700/50 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1"
                href="https://www.facebook.com/tamadrus"
                target="_blank"
                rel="noopener noreferrer"
                title="Rejoignez-nous sur Facebook"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </a>
              <a
                className="group flex items-center justify-center w-12 h-12 bg-slate-800/50 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 rounded-xl border border-slate-700/50 hover:border-pink-500 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-1"
                href="https://www.instagram.com/tamadrus"
                target="_blank"
                rel="noopener noreferrer"
                title="Suivez-nous sur Instagram"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </a>
              <a
                className="group flex items-center justify-center w-12 h-12 bg-slate-800/50 hover:bg-red-600 rounded-xl border border-slate-700/50 hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-1"
                href="https://www.youtube.com/@tamadrus"
                target="_blank"
                rel="noopener noreferrer"
                title="Abonnez-vous à notre chaîne YouTube"
              >
                <span className="sr-only">YouTube</span>
                <Youtube className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
