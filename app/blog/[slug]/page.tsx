import { posts } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = posts.find((p) => p.slug === slug);

    if (!post) return { title: "Post Not Found" };

    return {
        title: `${post.title} | 14 Blog`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: post.date,
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="container mx-auto max-w-3xl px-6 py-20 md:py-32">
            <div className="mb-12">
                <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-foreground">
                    <Link href="/blog">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>
                </Button>
            </div>

            <header className="mb-12 space-y-4">
                <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-muted-foreground">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>5 min read</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                    {post.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    {post.description}
                </p>
            </header>

            <div
                className="prose prose-neutral dark:prose-invert max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
          prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-xl
          prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </article>
    );
}

export async function generateStaticParams() {
    return posts.map((post) => ({
        slug: post.slug,
    }));
}
