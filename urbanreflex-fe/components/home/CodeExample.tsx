/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 15-11-2025
 * Description: Code example component displaying API usage examples in a terminal-style interface
 */

export default function CodeExample() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Terminal window */}
      <div className="bg-[#3d4148] rounded-2xl shadow-2xl overflow-hidden">
        {/* Terminal header */}
        <div className="bg-[#2d3139] px-4 py-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-gray-400 text-sm ml-4">urbanreflex.R</span>
        </div>
        
        {/* Code content */}
        <div className="p-6 font-mono text-sm">
          <div className="space-y-2">
            <div>
              <span className="text-[#c678dd]">library</span>
              <span className="text-white">(</span>
              <span className="text-[#98c379]">&quot;urbanreflex&quot;</span>
              <span className="text-white">)</span>
            </div>
            
            <div className="h-4"></div>
            
            <div>
              <span className="text-white">locations </span>
              <span className="text-[#56b6c2]">&lt;-</span>
              <span className="text-white"> urbanreflex</span>
              <span className="text-[#56b6c2]">::</span>
              <span className="text-[#61afef]">list_locations</span>
              <span className="text-white">(</span>
            </div>
            
            <div className="pl-4">
              <span className="text-[#e06c75]">parameters_id</span>
              <span className="text-white"> = </span>
              <span className="text-[#d19a66]">2</span>
              <span className="text-white">,</span>
            </div>
            
            <div className="pl-4">
              <span className="text-[#e06c75]">radius</span>
              <span className="text-white"> = </span>
              <span className="text-[#d19a66]">10000</span>
              <span className="text-white">,</span>
            </div>
            
            <div className="pl-4">
              <span className="text-[#e06c75]">coordinates</span>
              <span className="text-white"> = </span>
              <span className="text-[#61afef]">c</span>
              <span className="text-white">(</span>
              <span className="text-[#e06c75]">latitude</span>
              <span className="text-white"> = </span>
              <span className="text-[#56b6c2]">-73.0666</span>
              <span className="text-white">, </span>
              <span className="text-[#e06c75]">longitude</span>
              <span className="text-white"> = </span>
              <span className="text-[#56b6c2]">-36.7726</span>
              <span className="text-white">)</span>
            </div>
            
            <div>
              <span className="text-white">)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

