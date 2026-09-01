import React from "react";
import Nav from "@/components/Nav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import { getPostData, getAllPostSlugs } from "@/lib/posts";
import { marked } from "marked";
import styles from "@/components/SolutionTemplate.module.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const postData = getPostData(slug);
  return {
    title: `${postData.title} | Argus Resources`,
    description: postData.description,
    alternates: {
      canonical: `/resources/${slug}`,
    },
    openGraph: {
      title: postData.title,
      description: postData.description,
      type: "article",
      publishedTime: postData.date,
      authors: [postData.author],
    }
  };
}

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map((path) => ({
    slug: path.slug,
  }));
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const postData = getPostData(slug);
  
  // Convert Markdown to HTML
  const contentHtml = marked(postData.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: postData.title,
    description: postData.description,
    author: {
      "@type": "Organization",
      name: postData.author || "Argus Intelligence"
    },
    datePublished: postData.date,
  };

  return (
    <main id="top" className={styles.templateMain}>
      <Nav />
      <MobileBottomNav />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article style={{ paddingTop: "140px", paddingBottom: "100px", maxWidth: "800px", margin: "0 auto", paddingLeft: "5%", paddingRight: "5%" }}>
        <header style={{ marginBottom: "3rem", textAlign: "center" }}>
          <div style={{ color: "#a855f7", fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
            {postData.category} • {new Date(postData.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 700, lineHeight: 1.2, marginBottom: "1.5rem" }}>
            {postData.title}
          </h1>
          <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
            {postData.description}
          </p>
        </header>

        {postData.image && (
          <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: "16px", overflow: "hidden", marginBottom: "4rem", border: "1px solid rgba(255,255,255,0.1)" }}>
            <img src={postData.image} alt={postData.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        <div 
          className="prose prose-invert prose-lg max-w-none"
          style={{ 
            color: "rgba(255,255,255,0.85)", 
            lineHeight: 1.7,
            "--tw-prose-headings": "#fff",
            "--tw-prose-links": "#a855f7"
          }}
          dangerouslySetInnerHTML={{ __html: contentHtml }} 
        />
      </article>

      <Footer />
    </main>
  );
}
