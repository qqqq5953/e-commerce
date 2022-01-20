<template>
  <div
    class="toast-container position-absolute pe-3 end-0"
    style="bottom: 20px"
  >
    <Toast v-for="(msg, key) in messages" :key="key" :msg="msg" />
  </div>
</template>

<script>
import Toast from '@/components/Toast.vue';

export default {
  components: { Toast },
  data() {
    return {
      messages: []
    };
  },
  inject: ['emitter'],
  mounted() {
    this.emitter.on('push-message', (message) => {
      console.log('接收訊息');
      const { style = 'success', title, status, content } = message;
      this.messages.push({ style, title, status, content });
    });
  }
};
</script>
