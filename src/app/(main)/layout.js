// src/app/(main)/layout.js - Main app layout with Layout component
import Layout from "@/components/Layout";

export default function MainLayout({ children }) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}
