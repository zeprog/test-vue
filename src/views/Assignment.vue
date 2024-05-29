<template>
  <div class="assignment main-layout content-section">
    <assignmentTable :type="assignmentType" v-model="answers"/>
    <button @click="submit()" type="button" class="canvas-button" :class="{saved: saved}">
      {{saved ? "Задание отправлено" : "Отправить задание"}}
    </button>
    <div v-if="error" class="error">Ошибка интернет-соединения</div>
  </div>
</template>

<script>
import assignmentTable from '../components/assignmentTable'

export default {
  name: 'Assignment',
  components: {assignmentTable},
  data() {
    return {
      timer: null,
      saved: false,
      error: false
    }
  },
  methods: {
    submit() {
      if(this.saved)
        return;
      if(this.$store.state.ws.readyState === 1) {
        this.$store.dispatch('updateAnswers', this.answers);
        this.error = false;
        this.saved = true;
      } else {
        this.error = true;
      }
    }
  },
  computed: {
    assignmentType() {
      return this.$store.state.settings ? this.$store.state.settings.assignmentType : null;
    },
    answers: {
      get() {
        return this.$store.state.answers && this.$store.state.answers.length ? this.$store.state.answers : [];
      },
      set(answers) {
        this.$store.commit('setAnswers', answers);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          if(answers.toString().length > 3)
            this.saved = false;
            this.$store.dispatch('updateAnswers', answers);
        }, 1000)
      }
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  }
}
</script>

<style>
  @import "../assets/insert-table-student.css";
</style>

<style lang="sass" scoped>
  .canvas-button
    width: 190px
    background: #008ee2
    color: #fff
    border: 1px solid #0079c1
    border-radius: 3px
    transition: background-color 0.2s ease-in-out
    display: inline-block
    padding: 8px 14px
    font-size: 16px
    line-height: 20px
    text-align: center
    vertical-align: middle
    cursor: pointer
    outline: none
    margin: 20px 0 10px

    &:hover
      background: #0087d7

    &.saved
      background: #00AC18
      border: 1px solid #00600d
  .error
    color: red
</style>
