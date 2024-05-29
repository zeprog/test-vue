<template>
  <div :class="{journal: journal}">
    <div class="unsert-table-wrapper" v-if="type === 'johari'">
      <div class="unsert-table-wrapper__t-l-text">Я знаю</div>
      <div class="unsert-table-wrapper__t-r-text">Я не знаю</div>
      <div class="unsert-table-wrapper__l-t-text">Другие знают</div>
      <div class="unsert-table-wrapper__l-b-text">Другие не знают</div>
      <div class="unsert-table-wrapper__t-line"></div>
      <div class="unsert-table-wrapper__r-line"></div>
      <div class="unsert-table-wrapper__b-line"></div>
      <div class="unsert-table-wrapper__l-line"></div>
      <div class="unsert-table">
        <div class="unsert-table__item">
          <div class="unsert-table__headline">Открытая зона</div>
          <div class="textarea" v-if="journal">{{answers[0]}}</div>
          <textarea v-else :readonly="readonly" v-model="answers[0]" name="" cols="30" rows="10" placeholder="Напишите свой ответ"></textarea>
        </div>
        <div class="unsert-table__item">
          <div class="unsert-table__headline">Слепая зона</div>
          <div class="textarea" v-if="journal">{{answers[1]}}</div>
          <textarea v-else :readonly="readonly" v-model="answers[1]" name="" cols="30" rows="10" placeholder="Напишите свой ответ"></textarea>
        </div>
        <div class="unsert-table__item">
          <div class="unsert-table__headline">Скрытая зона</div>
          <div class="textarea" v-if="journal">{{answers[2]}}</div>
          <textarea v-else :readonly="readonly" v-model="answers[2]" name="" cols="30" rows="10" placeholder="Напишите свой ответ"></textarea>
        </div>
        <div class="unsert-table__item">
          <div class="unsert-table__headline">Зона неизвестного</div>
          <div class="textarea" v-if="journal">{{answers[3]}}</div>
          <textarea v-else :readonly="readonly" v-model="answers[3]" name="" cols="30" rows="10" placeholder="Напишите свой ответ"></textarea>
        </div>
      </div>
    </div>
    <div class="unsert-table" v-else>
      <div class="unsert-table__item">
        <div class="unsert-table__headline">Сильные стороны</div>
        <div class="textarea" v-if="journal">{{answers[0]}}</div>
        <textarea v-else :readonly="readonly" v-model="answers[0]" name="" cols="30" rows="10" placeholder="Напишите свой ответ"></textarea>
      </div>
      <div class="unsert-table__item">
        <div class="unsert-table__headline">Слабые стороны</div>
        <div class="textarea" v-if="journal">{{answers[1]}}</div>
        <textarea v-else :readonly="readonly" v-model="answers[1]" name="" cols="30" rows="10" placeholder="Напишите свой ответ"></textarea>
      </div>
      <div class="unsert-table__item">
        <div class="unsert-table__headline">Возможности</div>
        <div class="textarea" v-if="journal">{{answers[2]}}</div>
        <textarea v-else :readonly="readonly" v-model="answers[2]" name="" cols="30" rows="10" placeholder="Напишите свой ответ"></textarea>
      </div>
      <div class="unsert-table__item">
        <div class="unsert-table__headline">Угрозы</div>
        <div class="textarea" v-if="journal">{{answers[3]}}</div>
        <textarea v-else :readonly="readonly" v-model="answers[3]" name="" cols="30" rows="10" placeholder="Напишите свой ответ"></textarea>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'assignmentTable',
  props: ['type', 'value', 'readonly', 'journal'],
  data() {
    return {
      answers: []
    }
  },
  created() {
    this.answers = [...this.value];
    if(this.journal)
      return;
    this.$watch('answers', (a)=>{
      this.$emit('input', a);
    }, {
      deep: true
    });
  },
}
</script>

<style scoped lang="sass">
  .journal
    margin: 52px 0 0 210px

    .unsert-table-wrapper
      max-width: none

    .unsert-table
      max-width: none

  .unsert-table__item .textarea
    border: none
    color: #ADA0A2
    font-size: 14px
    padding: 16px 28px
    resize: none
    width: 100%
    white-space: pre-wrap
    min-height: 280px
</style>