import { cn } from "@/lib/utils";
import { FullWidthDivider } from "@/components/ui/full-width-divider";
import { posts } from "@/lib/blog-data";
import Link from "next/link";

export function BlogsSection() {
	return (
		<div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-start md:border-x">
			<div className="space-y-2 px-4 py-8 md:py-12">
				<h1 className="font-semibold text-2xl tracking-wide md:text-4xl text-primary">
					Latest Blogs
				</h1>
				<p className="text-muted-foreground text-sm">
					Discover the latest trends and insights in the world of dating, design, and
					technology.
				</p>
			</div>

			<div className="relative">
				<FullWidthDivider />
				<div className="divide-y">
					{posts.map((blog) => (
						<BlogCard
							key={blog.slug}
							title={blog.title}
							date={blog.date}
							description={blog.description}
							href={`/blog/${blog.slug}`}
						/>
					))}
				</div>
				<FullWidthDivider />
			</div>
		</div>
	);
}

function BlogCard({
	title,
	date,
	description,
	href,
	className,
}: {
	title: string;
	date: string;
	description: string;
	href: string;
	className?: string;
}) {
	return (
		<Link
			className={cn(
				"group flex h-auto min-h-24 w-full flex-col justify-center gap-y-1 p-6 hover:cursor-pointer hover:bg-accent/30 active:bg-accent dark:active:bg-accent/50 transition-colors",
				className
			)}
			href={href}
		>
			<div className="relative flex items-center justify-between gap-4">
				<h3 className="font-medium text-foreground text-lg md:text-xl group-hover:text-primary transition-colors">
					{title}
				</h3>
				<span className="whitespace-nowrap font-mono text-muted-foreground text-xs uppercase group-hover:text-foreground md:text-sm">
					{date}
				</span>
			</div>
			<div className="max-w-2xl text-muted-foreground text-sm group-hover:text-foreground md:text-base line-clamp-2">
				{description}
			</div>
		</Link>
	);
}

