<template>
  <q-page class="q-pa-sm">
    <div class="row flex flex-center">
      <!-- ------ -->

      <q-card
        class="q-pa-sm q-ma-sm col-xl-4 col-md-3 col-sm-12 my-card bg-primary text-white"
        @click="$router.push('masjid')"
      >
        <q-card-section class="q-mb-md q-ma-sm">
          <div class="teks absolute-center text-subtitle2 text-center">
            <i class="fas fa-mosque" style="font-size: 50px;"> </i>
          </div>
        </q-card-section>
        <div class="text-center">Masjid</div>
        <q-separator dark />

        <q-card-section class="absolute-right">
          <div class="text-h4 text-center">{{ datas.masjid }}</div>
        </q-card-section>
      </q-card>

      <!-- ------ -->

      <q-card
        class="q-pa-sm q-ma-sm col-xl-4 col-md-3 col-sm-12 my-card bg-primary text-white"
        @click="$router.push('flyer')"
      >
        <q-card-section class="q-mb-md q-ma-sm">
          <div class="teks absolute-center text-subtitle2 text-center">
            <i class="fa fa-image" style="font-size: 50px;"> </i>
          </div>
        </q-card-section>
        <div class="text-center">Flyer</div>
        <q-separator dark />

        <q-card-section class="absolute-right">
          <div class="text-h4 text-center">{{ datas.flyer }}</div>
        </q-card-section>
      </q-card>

      <!-- ------ -->

      <q-card
        class="q-pa-sm q-ma-sm col-xl-4 col-md-3 col-sm-12 my-card bg-primary text-white"
        @click="$router.push('kajian')"
      >
        <q-card-section class="q-mb-md q-ma-sm">
          <div class="teks absolute-center text-subtitle2 text-center">
            <i class="fa fa-clipboard" style="font-size: 50px;"> </i>
          </div>
        </q-card-section>
        <div class="text-center">Kajian</div>
        <q-separator dark />

        <q-card-section class="absolute-right">
          <div class="text-h4 text-center">{{ datas.kajian }}</div>
        </q-card-section>
      </q-card>

      <!-- ------ -->
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      datas: {}
    };
  },
  methods: {
    async loadData() {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/count-all`)
        .then(response => {
          this.datas = response.data;
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Terjadi kesalahan",
            icon: "report_problem"
          });
        });
    }
  },
  created() {
    this.loadData();
  }
};
</script>
<style scoped>
.my-card {
  cursor: pointer !important;
}
</style>
