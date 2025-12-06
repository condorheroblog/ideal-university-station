<script setup lang="ts">
const currentTime = new Date();
const hours = currentTime.getHours().toString().padStart(2, '0');
const minutes = currentTime.getMinutes().toString().padStart(2, '0');
const formattedTime = `${hours}:${minutes}`;

// 日期和星期
const date = new Date();
const month = date.getMonth() + 1;
const day = date.getDate();
const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
const formattedDate = `${month}月${day}日 週${weekDay}`;
const lunarDate = '甲辰年七月三十'; // 示例农历日期

// 天气信息
const temperature = 35;
const minTemp = 26;
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <!-- 手机框架 -->
    <div class="relative w-[320px] h-[640px] rounded-3xl overflow-hidden border-8 border-gray-800 bg-purple-600 text-white">
      <!-- 状态栏 -->
      <div class="flex justify-between items-center px-4 py-1 text-xs">
        <span>中国移动</span>
        <div class="flex items-center space-x-1">
          <span class="text-xs">4G</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>

      <!-- 时间和日期 -->
      <div class="flex flex-col items-center mt-6">
        <div class="text-7xl font-bold">{{ formattedTime }}</div>
        <div class="text-sm mt-1">{{ formattedDate }} · {{ lunarDate }}</div>
      </div>

      <!-- 天气信息 -->
      <div class="flex justify-center items-center mt-4 text-sm">
        <div class="flex items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>{{ temperature }}°</span>
        </div>
        <div>大致天晴</div>
        <div class="ml-4">最高{{ temperature }}° 最低{{ minTemp }}°</div>
      </div>

      <!-- 大学站点信息 -->
      <div class="text-center text-xs mt-6">
        <span>清华大学站</span>
        <span class="ml-2 px-2 py-0.5 rounded-full bg-white bg-opacity-20">成为上位</span>
      </div>

      <!-- 地铁卡片 -->
      <div class="bg-white mx-6 mt-4 rounded-xl p-4 text-purple-800">
        <!-- 地铁标题 -->
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <div class="w-6 h-6 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold mr-2">
              <span>B</span>
            </div>
            <div>
              <div class="font-bold">北京地铁</div>
              <div class="text-xs text-gray-500">BEIJING SUBWAY</div>
            </div>
          </div>
          <div class="flex items-center">
            <img src="https://upload.wikimedia.org/wikipedia/zh/8/88/Tsinghua_University_Logo.svg" alt="清华大学" class="w-8 h-8">
          </div>
        </div>

        <!-- 地铁线路信息 -->
        <div class="flex justify-between mt-4 border-t border-b border-gray-200 py-2">
          <div>
            <div class="text-xs text-gray-500">北京地铁4号线</div>
            <div class="font-bold">清华大学</div>
          </div>
        </div>

        <!-- 下一站信息 -->
        <div class="flex justify-between mt-4">
          <div>
            <div class="text-xs text-gray-500">下一站</div>
            <div class="font-bold">圆明园</div>
            <div class="text-xs text-gray-500">Next Station</div>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-500">YUANMINGYUAN PARK</div>
          </div>
        </div>

        <!-- 地铁线路图 -->
        <div class="mt-4">
          <div class="flex justify-between items-center">
            <div class="w-3 h-3 rounded-full bg-purple-600"></div>
            <div class="flex-1 h-0.5 bg-purple-600"></div>
            <div class="w-3 h-3 rounded-full bg-purple-600"></div>
            <div class="flex-1 h-0.5 bg-purple-600"></div>
            <div class="w-3 h-3 rounded-full bg-purple-600"></div>
            <div class="flex-1 h-0.5 bg-purple-600"></div>
            <div class="w-3 h-3 rounded-full bg-purple-600"></div>
            <div class="flex-1 h-0.5 bg-purple-600"></div>
            <div class="w-3 h-3 rounded-full bg-purple-600"></div>
          </div>
          <div class="flex justify-between text-xs mt-1">
            <span>北宫门</span>
            <span>西苑</span>
            <span>圆明园</span>
            <span>清华东路</span>
            <span>中关村</span>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="mt-6 text-center border-t border-dashed border-gray-300 pt-2">
          <div class="text-lg font-bold">自强不息 厚德载物</div>
          <div class="text-xs text-gray-500">Tsinghua University</div>
        </div>
      </div>

      <!-- 底部图标 -->
      <div class="absolute bottom-6 left-0 right-0 flex justify-around">
        <div class="w-10 h-10 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="w-10 h-10 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      <!-- 底部横条 -->
      <div class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-black rounded-full"></div>
    </div>
  </div>
</template>
