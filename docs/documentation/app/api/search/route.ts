/**
 * ============================================================================
 * UrbanReflex — Smart City Intelligence Platform
 * Copyright (C) 2025  WAG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * For more information, visit: https://github.com/minhe51805/UrbanReflex
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { source } from "@/app/source";

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

// Pre-generate search index at build time
export async function GET() {
  try {
    // Get all pages from source using generateParams
    const params = await source.generateParams();
    
    // Build search index
    const searchIndex = params
      .map((param) => {
        try {
          const slug = param.slug || [];
          const page = source.getPage(slug);
          if (page) {
            return {
              id: page.url,
              title: page.data.title || "",
              description: page.data.description || "",
              url: page.url,
            };
          }
        } catch (e) {
          // Skip if page can't be loaded
          console.error("Error loading page:", e);
        }
        return null;
      })
      .filter((page): page is NonNullable<typeof page> => page !== null);

    return NextResponse.json(searchIndex);
  } catch (error) {
    console.error("Search index generation error:", error);
    return NextResponse.json([]);
  }
}
