"use client";

import React from "react";
import { BadgeCheck, Calendar, ClipboardList, Utensils } from "lucide-react";

const sections = [
  {
    id: "weihnachtsspecials",
    title: "WEIHNACHTSSPECIALS",
    subtitle: "Offres Spéciales Noël",
    cards: [
      {
        title: "Winterfest Buffet",
        description: "Un menu festif pour un moment chaleureux et élégant.",
        bullets: ["4 plats à choisir", "18 plats disponibles"],
        price: "24,90",
        minPeople: "12",
        image:
          "https://images.unsplash.com/photo-1514516873439-d295bde6461c?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    id: "fingerfood",
    title: "FINGERFOOD MENÜS",
    subtitle: "Bouchées fines pour réceptions et cocktails.",
    cards: [
      {
        title: "Fingerfood Basic",
        description: "Simple, rapide et accessible pour tous les budgets.",
        bullets: ["4 plats à choisir", "23 plats disponibles"],
        price: "16,90",
        minPeople: "15",
        image:
          "https://images.unsplash.com/photo-1521979548744-463128ae5a3e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Fingerfood Classic",
        description: "Équilibre parfait pour un buffet convivial.",
        bullets: ["5 plats à choisir", "42 plats disponibles"],
        price: "21,90",
        minPeople: "15",
        image:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Fingerfood Premium",
        description: "Sélection généreuse et variée pour marquer les esprits.",
        bullets: ["6 plats à choisir", "53 plats disponibles"],
        price: "28,90",
        minPeople: "15",
        image:
          "https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    id: "buffet",
    title: "BÜFFET MENÜS",
    subtitle: "Buffets complets pour événements professionnels ou privés.",
    cards: [
      {
        title: "Buffet Basic",
        description: "Essentiel et efficace pour un service fluide.",
        bullets: ["2 entrées + 1 plat", "16 plats disponibles"],
        price: "20,90",
        minPeople: "10",
        image:
          "https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Buffet Classic",
        description: "Un choix équilibré pour satisfaire tous les goûts.",
        bullets: ["3 entrées + 2 plats + 1 dessert", "27 plats disponibles"],
        price: "24,90",
        minPeople: "20",
        image:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Buffet Premium",
        description: "Expérience gastronomique pour grandes occasions.",
        bullets: ["4 entrées + 1 soupe + 3 plats + 2 desserts", "29 plats disponibles"],
        price: "31,90",
        minPeople: "30",
        image:
          "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    id: "besondere-anlasse",
    title: "BESONDERE ANLÄSSE",
    subtitle: "Occasions spéciales sur mesure pour vos événements.",
    cards: [
      {
        title: "Gala Signature",
        description: "Un menu raffiné pour réceptions haut de gamme.",
        bullets: ["5 plats à choisir", "32 plats disponibles"],
        price: "39,90",
        minPeople: "25",
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Mariage Classique",
        description: "Équilibre et élégance pour une journée inoubliable.",
        bullets: ["4 plats à choisir", "28 plats disponibles"],
        price: "34,90",
        minPeople: "40",
        image:
          "https://images.unsplash.com/photo-1521283419942-6d0f394b79df?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    id: "dein-wunschcatering",
    title: "DEIN WUNSCHCATERING",
    subtitle: "Catering personnalisé selon vos envies.",
    cards: [
      {
        title: "Fingerfood À La Carte",
        description: "Composez votre sélection à la demande.",
        bullets: ["Choix sans limite", "66 plats disponibles"],
        price: "22,90",
        minPeople: "15",
        image:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Buffet À La Carte",
        description: "Buffet personnalisé pour toutes les tailles.",
        bullets: ["Choix sans limite", "39 plats disponibles"],
        price: "26,90",
        minPeople: "20",
        image:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    id: "office-menus",
    title: "OFFICE MENÜS",
    subtitle: "Solutions pratiques pour pauses déjeuner et réunions.",
    cards: [
      {
        title: "Office Lunch",
        description: "Menu simple pour équipes et séminaires.",
        bullets: ["3 plats à choisir", "20 plats disponibles"],
        price: "18,90",
        minPeople: "10",
        image:
          "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Meeting Break",
        description: "Collations et douceurs pour vos réunions.",
        bullets: ["2 plats à choisir", "14 plats disponibles"],
        price: "12,90",
        minPeople: "8",
        image:
          "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
];

const steps = [
  {
    title: "Étape 1",
    description: "Choisissez votre menu et vos options.",
    icon: Calendar,
  },
  {
    title: "Étape 2",
    description: "Ajoutez vos préférences et détails.",
    icon: ClipboardList,
  },
  {
    title: "Étape 3",
    description: "Confirmez le nombre de personnes.",
    icon: Utensils,
  },
  {
    title: "Étape 4",
    description: "Validez et profitez d'un service fluide.",
    icon: BadgeCheck,
  },
];

export default function Reports() {
  return (
    <div className="menus-page">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");

        body {
          font-family: "Inter", sans-serif;
          background: #ffffff;
          color: #2c3e50;
        }
      `}</style>

      <div className="page-header">
        <h1>Tous nos Menus</h1>
      </div>

      {sections.map((section) => (
        <section key={section.id} className="menu-section">
          <div className="section-divider" />
          <div className="section-header">
            <h2>{section.title}</h2>
            <p>{section.subtitle}</p>
          </div>

          <div className="menu-grid">
            {section.cards.map((card) => (
              <div key={card.title} className="menu-card">
                <div className="menu-image">
                  <img src={card.image} alt={card.title} loading="lazy" />
                </div>
                <div className="menu-content">
                  <h3>{card.title}</h3>
                  <p className="menu-description">{card.description}</p>
                  <ul>
                    {card.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <div className="menu-price">
                    <span>à partir de</span> {card.price} €/personne
                  </div>
                  <div className="menu-meta">zzgl. MwSt (HT)</div>
                  <div className="menu-meta">à partir de {card.minPeople} personnes</div>
                  <button type="button">Sélectionner</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="menu-section steps-section">
        <div className="section-divider" />
        <div className="section-header">
          <h2>IMMER EINFACH, JEDES MAL</h2>
          <p>Comment ça marche - 4 étapes</p>
        </div>
        <div className="steps-grid">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="step-card">
                <div className="step-icon">
                  <Icon size={40} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <style jsx>{`
        .menus-page {
          background: #ffffff;
          padding-bottom: 80px;
        }

        .page-header {
          padding: 48px 24px 16px;
          text-align: center;
        }

        .page-header h1 {
          font-size: 36px;
          font-weight: 700;
          color: #2c3e50;
        }

        .menu-section {
          background: #f8f9fa;
          margin-top: 80px;
          padding: 40px 24px 64px;
        }

        .section-divider {
          height: 1px;
          background: #e0e0e0;
          margin-bottom: 24px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .section-header h2 {
          font-size: 32px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .section-header p {
          font-size: 16px;
          font-weight: 400;
          color: #6c757d;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .menu-card {
          border-radius: 12px;
          border: 1px solid #e0e0e0;
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .menu-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }

        .menu-image img {
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          border-radius: 12px 12px 0 0;
          display: block;
        }

        .menu-content {
          padding: 24px;
        }

        .menu-content h3 {
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .menu-description {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 16px;
        }

        .menu-content ul {
          list-style: disc;
          padding-left: 18px;
          margin: 0 0 16px;
          color: #2c3e50;
          font-size: 14px;
        }

        .menu-price {
          font-size: 20px;
          font-weight: 700;
          color: #e85d33;
          margin-bottom: 4px;
        }

        .menu-price span {
          font-size: 14px;
          font-weight: 400;
          color: #2c3e50;
        }

        .menu-meta {
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 6px;
        }

        .menu-content button {
          margin-top: 16px;
          padding: 12px 32px;
          background: #e85d33;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .menu-content button:hover {
          background: #d04a21;
          transform: scale(1.02);
        }

        .steps-section {
          padding-bottom: 80px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .step-card {
          text-align: center;
          background: transparent;
          padding: 16px;
        }

        .step-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 16px;
          border-radius: 999px;
          background: rgba(232, 93, 51, 0.12);
          color: #e85d33;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-card h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .step-card p {
          font-size: 14px;
          color: #6c757d;
        }

        @media (min-width: 768px) {
          .menu-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }

          .steps-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .menu-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 24px;
          }

          .steps-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        @media (max-width: 767px) {
          .menu-content button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}