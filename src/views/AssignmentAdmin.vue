<template>
  <div class="settings main-layout">
    <div class="content-section" v-if="!$store.state.settings || !$store.state.settings.assignmentType">
      <div class="select-wrapper js-select-wrapper">
        <div class="select js-select">{{ settings.assignmentType ? assignmentTypesMap[settings.assignmentType] : 'Выберите тип задания'}}</div>
        <select v-model="settings.assignmentType">
          <option v-for="key in Object.keys(assignmentTypesMap)" :value="key">
            {{ assignmentTypesMap[key] }}
          </option>
        </select>
      </div>
      <br/>
      <button class="button" @click="saveSettings">Сохранить</button>
    </div>
    <div class="content-section" v-else>
      <div class="select-wrapper js-select-wrapper">
        <div class="select js-select">{{ filter !== 'all' ? submissionsFiltered[0].name : 'Все ответы'}}</div>
        <select v-model="filter">
          <option value="all">Все ответы</option>
          <option v-for="submission in submissions" :value="submission.userId">
            {{ submission.name }}
          </option>
        </select>
      </div>
      <br/>
      <br/>
      <div class="students-list">
        <div class="students-list__item" v-for="submission in submissionsFiltered">
          <div class="mini-title">{{submission.name}} <a :href="`mailto:${submission.email}`">{{submission.email}}</a></div>
          <assignmentTable :type="$store.state.settings.assignmentType" v-model="submission.answers" :readonly="true"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import assignmentTable from '../components/assignmentTable'

export default {
  name: 'AssignmentAdmin',
  components: {assignmentTable},
  data() {
    return {
      settings: {},
      assignmentTypesMap: {
        swot: 'SWOT',
        johari: 'Окно Джохари'
      },
      filter: 'all'
    }
  },
  computed: {
    submissions() {
      return this.$store.state.submissions;
    },
    submissionsFiltered() {
      if(this.filter === 'all')
        return this.submissions;
      return [this.submissions.find(e => e.userId === this.filter)];
    }
  },
  methods: {
    saveSettings() {
      this.$store.dispatch('updateSettings', this.settings)
    }
  },
}
</script>

<style>
  @import "../assets/insert-table-teacher.css";
</style>

<style lang="sass" scoped>
  .select-wrapper select
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    opacity: 0
</style>