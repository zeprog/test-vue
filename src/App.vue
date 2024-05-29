<template>
  <div id="app">
    <component v-if="role" :is="view"/>
  </div>
</template>

<script>
  import Assignment from "./views/Assignment";
  import AssignmentAdmin from "./views/AssignmentAdmin";
  import Journal from "./views/Journal";
  import JournalAdmin from "./views/JournalAdmin";

  export default {
    components: {Assignment, AssignmentAdmin, Journal, JournalAdmin},
    created() {
      this.$store.dispatch('wsConnect');
      const resizeObserver = new ResizeObserver(() => {
        window.parent.postMessage(JSON.stringify({
          subject: 'lti.frameResize',
          height: document.documentElement.scrollHeight
        }), '*');
      });
      resizeObserver.observe(document.documentElement);
    },
    computed: {
      role() {
        return this.$store.state.role;
      },
      isAssignment() {
        return this.$store.state.isAssignment;
      },
      view() {
        if(this.role === 'Instructor') {
          if(this.isAssignment)
            return AssignmentAdmin;
          else
            return JournalAdmin;
        } else {
          if(this.isAssignment)
            return Assignment;
          else
            return Journal;
        }
      }
    }
  }
</script>

<style lang="sass">
  body
    margin: 0

  #app
    background: white
    overflow: auto
</style>
