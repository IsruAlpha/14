import { BlogsSection } from "@/components/blogs-section";
import { posts } from "@/lib/blog-data";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog | 14 - Dating Insights",
    description: "Stay updated with the latest trends in dating, relationships, and tech for 2026.",
};

export default function BlogPage() {
    return (
        <main className="py-20">
            <BlogsSection />
        </main>
    );
}
