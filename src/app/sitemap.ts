import { MetadataRoute } from "next";

async function getSubjects() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_API_URL ||
        "https://studyhere-backend.asigdel.com.np/api"
      }/subject?sortOrder=desc&sortBy=views&limit=1000`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    );
    const data = await response.json();
    return data.data.subjects || [];
  } catch (error) {
    console.error("Error fetching subjects for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all subjects for dynamic routes
  const subjects = await getSubjects();

  // Base URL from environment variable or default
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://studyhere.asigdel.com.np";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic routes for subjects
  const subjectRoutes = subjects.map(
    (subject: { slug: string; updatedAt: string }) => ({
      url: `${baseUrl}/subject/${subject.slug}`,
      lastModified: subject.updatedAt
        ? new Date(subject.updatedAt)
        : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })
  );

  return [...staticRoutes, ...subjectRoutes];
}
