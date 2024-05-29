<template>
  <div>
    <div class="main-layout">
      <div class="content-section"><h2 class="content-section__title">Скачать Журнал</h2></div>
      <div class="content-section"><p class="task-desc" v-html="greetings"></p>
      </div>
      <div class="content-section">
        <div class="button" :class="{saving: saving}" @click="downloadPdf">{{saving ? 'Формируется' : 'Сформировать'}}</div>
      </div>
    </div>

    <div class="shadow-page" :class="{'journal-layout journal-cover' : !cover.includes('journal-layout')}" v-html="cover">
    </div>

    <div class="journal-layout journal-page" 
         v-for="a in $store.state.answers" 
         v-if="a && ((a.answer && a.answer.length) || (a.questions && atLeastOneAnswered(a.questions)))"
    >
      <div v-html="page(a.desc)"/>
      <div v-if="a.questions" class="journal-answers" v-html="answers(a.questions)"></div>
      <div v-else-if="!a.ltiSubmission" class="journal-answer" v-html="a.answer"></div>
      <assignment-table v-else :type="a.assignmentType" :value="a.answer" :journal="true"/>
    </div>

    <div class="shadow-page" :class="{'journal-layout journal-back' : !back.includes('journal-layout')}" v-html="back">
    </div>

    <component is="style" v-html="styles"/>

  </div>
</template>

<script>
import AssignmentTable from "../components/assignmentTable";
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import templates from '@/assets/templates.json';


export default {
  name: 'Journal',
  components: {AssignmentTable},
  data() {
    return {
      saving: false
    }
  },
  methods: {
    async downloadPdf() {
      this.saving = true;
      await this.$store.dispatch('journalDownloaded');
      const pages = document.getElementsByClassName('journal-layout');
      let doc = new jsPDF();
      for (let i = 0; i < pages.length; i++) {
        if(i !== 0)
          doc.addPage();
        const canvas = await html2canvas(pages[i], {scale: 1, logging: false, scrollY: 0, proxy: 'proxy'});
        let imgData = canvas.toDataURL('image/jpeg', 0.9);
        let imgWidth = 210;
        let pageHeight = 297;
        let imgHeight = Math.round(canvas.height * imgWidth / canvas.width);
        doc.addImage(imgData, 'JPG', 0, 0, imgWidth, imgHeight);
        let heightLeft = imgHeight - pageHeight;
        let padding = 10;
        while(heightLeft > 0) {
          let position = heightLeft - imgHeight;
          doc.setFillColor(255,255,255);
          doc.rect(0, pageHeight - padding, imgWidth, padding, 'F');
          doc.addPage();
          doc.addImage(imgData, 'JPG', 0, position + padding * 2, imgWidth, imgHeight);
          doc.setFillColor(255,255,255);
          doc.rect(0, 0, imgWidth, padding, 'F');
          heightLeft -= pageHeight - padding;
        }
      }
      doc.save(`Journal.pdf`);
      this.saving = false;
    },
    page(desc) {
      const template = this.$store.state.settings.page ? this.$store.state.settings.page : templates.page;
      return template.replace('{{description}}', desc);
    },
    answers(questions) {
      let output = ""
      for(let question of questions) {
        if(!question.answer)
          continue;
        output += `<div class="question">${question.text}</div><div class="answer">${question.answer}</div>`
      }
      return output;
    },
    atLeastOneAnswered(questions) {
      for(let question of questions) {
        if(question.answer)
          return true;
      }
      return false;
    },
  },
  computed: {
    cover() {
      return this.$store.state.settings.cover ? this.$store.state.settings.cover : templates.cover;
    },
    back() {
      return this.$store.state.settings.back ? this.$store.state.settings.back : templates.back;
    },
    styles() {
      return this.$store.state.settings.styles ? this.$store.state.settings.styles : templates.styles;
    },
    greetings() {
      return this.$store.state.settings.greetings ? this.$store.state.settings.greetings : templates.greetings;
    },
  }
}
</script>

<style lang="sass">
  .button
    width: 230px
    text-align: center
    &.saving
      pointer-events: none
      opacity: .8

  .shadow-page
    position: fixed
    top: -9999px

  .journal-layout
    position: fixed !important
    top: -9999px
    width: 1240px
    min-height: 1754px
</style>