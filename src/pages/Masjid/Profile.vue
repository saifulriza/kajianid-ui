<template>
  <q-page class="flex flex-center">
    <q-card class="my-card q-ma-sm" v-if="Object.keys(datas).length !== 0">
      <q-card-section>
        <div class="col-12 full-width" v-if="datas.foto.length > 0">
          <q-carousel
            animated
            v-model="slide"
            navigation
            infinite
            autoplay
            arrows
            transition-prev="slide-right"
            transition-next="slide-left"
            size="100px"
            style="max-height:300px"
          >
            <q-carousel-slide
              v-for="data in datas.foto"
              :key="data.id"
              :name="data.id"
              :img-src="data.link"
            />
          </q-carousel>
        </div>
        <br />
        <div class="row flex flex-center">
          <div class="text-h4">{{ datas.jenis }} {{ datas.nama }}</div>
          <br />
        </div>
        <div class="row flex flex-center">
          <div class="text-subtitle2">
            {{ datas.alamat !== null ? datas.alamat.nama : "Belum ada" }}
          </div>
        </div>
        <q-separator />
        <br />
        <div class="row flex flex-center">
          <div class="text-caption text-center col-8">
            <i>{{ datas.profil }}</i>
          </div>
        </div>
        <br />
      </q-card-section>
    </q-card>
    <div class="row" v-if="typeof datas.kajian !== 'undefined'">
      <div class="row" v-if="datas.kajian.length > 0">
        <div class="col-12 q-pa-md ">
          <q-card class="q-ma-sm">
            <q-table
              title="Jadwal Kajian"
              :data="row"
              :columns="columns"
              color="primary"
              row-key="name"
              :loading="loading"
              @row-click="onRowClick"
            >
              <template v-slot:loading>
                <q-inner-loading showing color="primary" />
              </template>
            </q-table>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: "MasjidProfile",
  data() {
    return {
      loading: true,
      slide: 1,
      datas: {},
      columns: [
        {
          name: "hari",
          align: "center",
          label: "Hari",
          field: "hari",
          sortable: true
        },
        {
          name: "jam",
          label: "Jam",
          field: row =>
            row.jam_mulai.slice(0, -3) + " - " + row.jam_selesai.slice(0, -3),
          sortable: true
        },
        { name: "bahasan", label: "Bahasan", field: "bahasan" }
      ],
      row: []
    };
  },
  methods: {
    onRowClick(evt, row) {
      return this.$router.push(`/kajian/id/${row.id}`);
    },
    async loadData() {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/masjid/${this.$route.params.id}`)
        .then(response => {
          this.datas = response.data[0];
          this.row = this.datas.kajian;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    }
  },
  async created() {
    await this.loadData();
    this.loading = false;
  }
};
</script>
<style scoped></style>
