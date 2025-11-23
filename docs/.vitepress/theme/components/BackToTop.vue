<template>
  <Transition name="fade">
    <div
      v-show="showBackTop"
      class="back-to-top"
      title="返回顶部"
      @click="scrollToTop"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 19V5M12 5L5 12M12 5L19 12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { inBrowser } from 'vitepress'

const showBackTop = ref(false)

const handleScroll = () => {
  if (!inBrowser) return
  showBackTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  if (!inBrowser) return
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  if (inBrowser) {
    window.addEventListener('scroll', handleScroll)
    // 初始检查
    handleScroll()
  }
})

onBeforeUnmount(() => {
  if (inBrowser) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 80px;
  right: 32px;
  width: 48px;
  height: 48px;
  background: var(--vp-c-brand, #6DB33F);
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(109, 179, 63, 0.3);
  transition: all 0.3s ease;
  z-index: 100;
}

.back-to-top:hover {
  background: var(--vp-c-brand-dark, #5d9d35);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(109, 179, 63, 0.4);
}

.back-to-top:active {
  transform: translateY(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .back-to-top {
    bottom: 60px;
    right: 24px;
    width: 44px;
    height: 44px;
  }

  .back-to-top svg {
    width: 20px;
    height: 20px;
  }
}
</style>
