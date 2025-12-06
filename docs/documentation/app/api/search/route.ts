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

import { NextRequest, NextResponse } from "next/server";
import { source } from "@/app/source";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query || query.trim().length === 0) {
    return NextResponse.json([]);
  }

  try {
    // Get all pages from source using generateParams
    const params = await source.generateParams();
    const queryLower = query.toLowerCase().trim();
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 0);
    
    // Get all pages from params
    const allPages = params
      .map((param) => {
        try {
          const slug = param.slug || [];
          const page = source.getPage(slug);
          if (page) {
            return {
              data: page.data,
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
    
    console.log("Total pages found:", allPages.length);
    
    // Search implementation - search in title, description, and headings
    const results = allPages
      .map((page) => {
        const title = page.data.title || "";
        const description = page.data.description || "";
        const url = page.url;
        
        // Get headings from TOC if available
        const headings = page.data.toc?.map((item: any) => item.title).join(" ") || "";
        
        // Combine all searchable text
        const searchableText = `${title} ${description} ${headings}`.toLowerCase();
        
        // Calculate relevance score
        let score = 0;
        
        // Exact title match gets highest score
        if (title.toLowerCase() === queryLower) {
          score += 100;
        } else if (title.toLowerCase().startsWith(queryLower)) {
          score += 50;
        } else if (title.toLowerCase().includes(queryLower)) {
          score += 30;
        }
        
        // Word matching in title
        queryWords.forEach((word) => {
          if (title.toLowerCase().includes(word)) {
            score += 10;
          }
        });
        
        // Description matching
        if (description.toLowerCase().includes(queryLower)) {
          score += 20;
        }
        queryWords.forEach((word) => {
          if (description.toLowerCase().includes(word)) {
            score += 5;
          }
        });
        
        // Heading matching
        queryWords.forEach((word) => {
          if (headings.toLowerCase().includes(word)) {
            score += 8;
          }
        });
        
        // General text matching
        if (searchableText.includes(queryLower)) {
          score += 1;
        }
        
        if (score > 0) {
          return {
            id: url, // Use URL as unique ID for React key
            title,
            description: description || "No description available",
            url,
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => {
        // Sort by title alphabetically for same score
        return a.title.localeCompare(b.title);
      })
      .slice(0, 10); // Limit to 10 results

    console.log("Search results count:", results.length);
    
    // Return direct array - Fumadocs expects array directly
    const response = Array.isArray(results) ? results : [];
    console.log("Returning response:", response.length, "items");
    return NextResponse.json(response);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json([]);
  }
}
