<template>
  <q-page class="q-pa-sm">
    <div class="row flex flex-center">
      <q-card
        class="q-pa-sm q-ma-sm col-xl-4 col-md-3 col-sm-12 my-card bg-primary text-white"
        @click="$router.push('admin-guru')"
      >
        <q-card-section class="q-mb-md q-ma-sm">
          <div class="teks absolute-center text-subtitle2 text-center">
            <i class="fa fa-users" style="font-size: 50px;"> </i>
          </div>
        </q-card-section>
        <div class="text-center">Admin Guru</div>
        <q-separator dark />

        <q-card-section class="absolute-right">
          <div class="text-h4 text-center">{{ datas.adminguru }}</div>
        </q-card-section>
      </q-card>

      <!-- ------ -->

      <q-card
        class="q-pa-sm q-ma-sm col-xl-4 col-md-3 col-sm-12 my-card bg-primary text-white"
        @click="$router.push('admin-masjid')"
      >
        <q-card-section class="q-mb-md q-ma-sm">
          <div class="teks absolute-center text-subtitle2 text-center">
            <i class="fa fa-users" style="font-size: 50px;"> </i>
          </div>
        </q-card-section>
        <div class="text-center">Admin Masjid</div>
        <q-separator dark />

        <q-card-section class="absolute-right">
          <div class="text-h4 text-center">{{ datas.adminmasjid }}</div>
        </q-card-section>
      </q-card>

      <!-- ------ -->

      <q-card
        class="q-pa-sm q-ma-sm col-xl-4 col-md-3 col-sm-12 my-card bg-primary text-white"
        @click="$router.push('guru')"
      >
        <q-card-section class="q-mb-md q-ma-sm">
          <div class="teks absolute-center text-subtitle2 text-center">
            <i class="fas fa-chalkboard-teacher" style="font-size: 50px;"> </i>
          </div>
        </q-card-section>
        <div class="text-center">Guru</div>
        <q-separator dark />

        <q-card-section class="absolute-right">
          <div class="text-h4 text-center">{{ datas.guru }}</div>
        </q-card-section>
      </q-card>

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

      <q-card
        class="q-pa-sm q-ma-sm col-xl-4 col-md-3 col-sm-12 my-card bg-primary text-white"
        @click="$router.push('notifikasi')"
      >
        <q-card-section class="q-mb-md q-ma-sm">
          <div class="teks absolute-center text-subtitle2 text-center">
            <i class="fa fa-bell" style="font-size: 50px;"> </i>
          </div>
        </q-card-section>
        <div class="text-center">Notifikasi</div>
        <q-separator dark />

        <q-card-section class="absolute-right">
          <div class="text-h4 text-center">{{ notifikasi.total_count }}</div>
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
      notifikasi: {},
      datas: {}
    };
  },
  methods: {
    async loadData() {
      let config = {
        headers: {
          Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`
        }
      };
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

      // get notifikasi
      await this.$axios
        .get(
          `https://onesignal.com/api/v1/notifications?app_id=${process.env.ONESIGNAL_APP_ID}`,
          config
        )
        .then(response => {
          this.notifikasi = response.data;
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
<style lang="sass" src="./Index.sass" scoped></style>
