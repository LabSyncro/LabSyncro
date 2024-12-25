<script lang="ts" setup>
definePageMeta({
  middleware: ['permission'],
  permission: 'home:own',
});

const router = useRouter();

const detectVirtualKeyboard = () => {
  let currentInput = '';
  const keyTimes = [];
  let start = 0;

  const handleKeyDown = (e) => {
    start = new Date().getTime();
  };

  const handleKeyUp = (e) => {
    const keyTime = new Date().getTime() - start;
    keyTimes.push(keyTime);

    // Capture the current key
    currentInput += e.key;

    // Check if we've reached 7 characters
    if (currentInput.length === 7) {
      const sumKeyTime = keyTimes.reduce((x, y) => x + y);
      const avgKeyTime = sumKeyTime / keyTimes.length;

      // If average key press time is less than 25ms, likely a virtual keyboard
      if (avgKeyTime < 25) {
        router.push({
          path: '/admin/borrows/form',
          query: { userId: currentInput }
        });

        // Remove event listeners
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      }
    }
  };

  // Attach listeners to document
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
};

onMounted(() => {
  detectVirtualKeyboard();
});</script>

<template>
  <div>
    <div>
      <IntroBanner />
    </div>
    <div>
      <DeviceBorrowSection />
    </div>
  </div>
</template>
