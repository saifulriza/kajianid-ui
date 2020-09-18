<template>
  <q-page class="row flex flex-center">
    <q-card class="q-ma-sm col-10 q-pa-sm">
      <div v-if="masjid.foto.length > 0">
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
            v-for="foto in masjid.foto"
            :key="foto.id"
            :name="foto.id"
            :img-src="foto.link"
          />
        </q-carousel>
      </div>
    </q-card>
    <div class="q-mt-lg q-mb-lg">
      <div class="col-xl-10 col-md-10 col-sm-12 text-center">
        <div class="text-h4">{{ masjid.jenis }} {{ masjid.nama }}</div>
        Alamat :
        {{
          typeof masjid.alamat !== "undefined" && masjid.alamat !== null
            ? masjid.alamat.nama
            : "Belum ada"
        }}
      </div>
      <q-separator />
      <div class="col-8">
        <div class="text-caption text-center ">
          <i>{{ masjid.profil }}</i>
        </div>
      </div>
    </div>
    <div
      class="col-xl-8 col-md-8 col-sm-12 q-pa-md "
      v-if="typeof masjid.kajian !== 'undefined' && masjid.kajian.length > 0"
    >
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
  </q-page>
</template>
<script>
import Masjid from "models/Masjid";
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
          Masjid.insert({
            data: this.datas
          });
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
  },
  computed: {
    masjid() {
      return Masjid.find(this.$route.params.id);
    }
  }
};
</script>
<style scoped></style>
