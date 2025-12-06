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

import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

const basePath = process.env.GITHUB_PAGES === 'true' ? '/UrbanReflex' : '';

export const baseOptions: BaseLayoutProps = {
    nav: {
        title: (
            <div className="flex items-center gap-3">
                <div className="w-20 h-20 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center p-1.5">
                    <img
                        src={`${basePath}/img/logo.png`}
                        alt="UrbanReflex Logo"
                        width={200}
                        height={200}
                        className="w-full h-full object-contain"
                    />
                </div>
                <span className="font-black text-xl">UrbanReflex</span>
            </div>
        ),
    },
    links: [
        {
            text: "Docs",
            url: "/docs",
            active: "nested-url",
        },
        {
            text: "GitHub",
            url: "https://github.com/minhe51805/UrbanReflex",
            external: true,
        },
    ],
};
