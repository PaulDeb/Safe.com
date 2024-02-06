import React from "react";

import "../../scss/about.scss";

const About = () => {
    return (
        <div className="about-container">
            <div className="about-title">
                À propos de nous
            </div>
            <div className="about-paragraph">
                Bienvenue sur Safe.com, votre destination ultime pour maîtriser l'agilité sous
                la direction passionnée de Lucie Bomel, designer et chef de projet, ainsi que
                Samuel Caillot, développeur chevronné.
            </div>
            <div className="about-paragraph">
                <div className="about-paragraph-title">
                    Notre Mission
                </div>
                À l'ère dynamique du développement et de la gestion de projet, nous avons créé 
                Safe.com avec une mission claire : faciliter l'apprentissage de l'agilité de
                manière accessible, pratique et inspirante. Notre objectif est de fournir une
                plateforme où les professionnels de tous horizons peuvent acquérir les compétences
                nécessaires pour naviguer avec succès dans un environnement professionnel en
                constante évolution.
            </div>

            <div className="about-paragraph">
                <div className="about-paragraph-title">
                    Qui sommes-nous?
                </div>

                <div className="about-person">
                    Lucie Bomel - Designer et Chef de Projet
                </div>
                Lucie apporte son expertise en design et gestion de projet, fusionnant esthétique
                et fonctionnalité pour créer des expériences utilisateur exceptionnelles. Son
                expérience approfondie dans la conduite de projets agiles garantit une approche
                holistique et orientée vers les résultats.
            </div>
            <div className="about-paragraph">
                <div className="about-person">
                    Samuel Caillot - Développeur
                </div>
                Samuel, passionné de développement, apporte une perspective technique solide à
                Safe.com. Son expérience diversifiée en programmation et sa compréhension
                approfondie des méthodologies agiles enrichissent notre contenu de manière à le
                rendre pertinent et applicable dans le monde réel.
            </div>

            <div className="about-paragraph">
                <div className="about-paragraph-title">
                    Ce que nous offrons
                </div>
                <ul>
                    <li>
                        <u>Cours Pratiques</u> Des cours interactifs basés
                        sur des scénarios réels pour renforcer votre compréhension de l'agilité.
                    </li>
                    <li>
                        <u>Ressources Riches</u> Des guides, des études de
                        cas et des articles approfondis pour vous tenir informé des dernières
                        tendances et meilleures pratiques.
                    </li>
                    <li>
                        <u>Communauté Engagée</u> Rejoignez notre communauté
                        dynamique pour échanger des idées, poser des questions et partager vos
                        expériences avec d'autres passionnés d'agilité.
                    </li>
                </ul>

                Rejoignez-nous dans cette aventure d'apprentissage continu. Safe.com est votre
                partenaire dévoué pour développer les compétences dont vous avez besoin pour
                exceller dans un monde professionnel agile.<br/>
                <br/>
                Faites le premier pas vers une transformation professionnelle dès aujourd'hui!
            </div>
        </div>
    );
};

export default About;