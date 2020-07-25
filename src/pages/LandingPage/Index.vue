<template>
  <q-page>
    <div class="q-pa-md">
      <!-- skeleton -->
      <q-skeleton height="250px" v-if="loading" />
      <!-- end skeleton -->
      <div v-if="!loading">
        <q-carousel
          animated
          v-model="slide"
          navigation
          infinite
          :autoplay="autoplay"
          arrows
          height="15rem"
          transition-prev="slide-right"
          transition-next="slide-left"
          @mouseenter="autoplay = false"
          @mouseleave="autoplay = true"
        >
          <q-carousel-slide
            v-for="fly in flyer"
            :key="fly.id"
            :name="fly.id"
            :img-src="fly.gambar"
          />
        </q-carousel>
      </div>
      <q-input
        @keydown.enter="redirect(text)"
        filled
        v-model="text"
        :dense="dense"
        class="q-mt-sm"
        placeholder="Cari Kajian.."
      >
        <template v-slot:append>
          <q-icon name="fa fa-search" />
        </template>
      </q-input>
      <!-- skeleton -->

      <q-markup-table v-if="loading">
        <thead>
          <tr>
            <th class="text-left" style="width: 150px">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="n in 3" :key="n">
            <td class="text-left">
              <q-skeleton animation="blink" type="text" width="85px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="50px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="35px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="65px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="25px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="85px" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <!-- end skeleton -->

      <div v-if="!loading">
        <q-table
          title="Daftar Kajian Hari Ini"
          class="q-mt-sm"
          :data="data"
          :columns="columns"
          row-key="id"
          @row-click="onRowClick"
        >
          <template v-slot:top>
            <q-btn
              color="primary"
              class="q-ma-sm"
              :disable="loading"
              label="Semua Kajian"
              @click="redirectKajian"
            />
            <div v-if="lokasi">
              <q-btn
                color="primary"
                class="q-ma-sm"
                :disable="loading"
                :label="`Kajian di ${lokasi.address.village}`"
                @click="redirect(lokasi.address.village)"
              />
            </div>
            <div v-if="!lokasi">
              <q-btn
                color="primary"
                class="q-ma-sm"
                :disable="loading"
                :label="`Kajian di ${hasillatlong.address.village}`"
                @click="redirect(hasillatlong.address.village)"
              />
            </div>
            <q-space />
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageIndex",
  data() {
    return {
      tanya: false,
      hasillatlong: {},
      pos: {},
      loading: true,
      dense: false,
      text: "",
      slide: 1,
      autoplay: true,
      kajians: {},
      latlong: "",
      flyer: {},
      lokasi: {},
      columns: [
        {
          name: "jam",
          align: "center",
          label: "Mulai",
          field: row => row.jam_mulai.slice(0,-3) + " - " + row.jam_selesai.slice(0,-3),
          sortable: true
        },
        {
          name: "masjid",
          label: "Lokasi",
          field: row =>
            row.masjid == null ? "Belum ditentukan" : row.masjid.nama,
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        },
        {
          name: "guru",
          label: "Penceramah",
          field: row => (row.guru == null ? "Belum ditentukan" : row.guru.nama),
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        },
        {
          name: "bahasan",
          required: true,
          label: "Bahasan",
          align: "left",
          field: "bahasan",
          format: val => `${val}`,
          sortable: true
        }
      ],
      data: []
    };
  },
  methods: {
    reverseLatlong(lat, long) {
      this.$axios
        .get(
          `https://locationiq.org/v1/reverse.php?key=3d0e63349939df&lat=${lat}&lon=${long}&format=json`
        )
        .then(response => {
          this.hasillatlong = response.data;
          var date = new Date().getDate();
          localStorage.setItem(
            `lokasi${date}`,
            JSON.stringify(this.hasillatlong)
          );
          this.$q.notify({
            type: "positive",
            position: "top",
            message: `Anda terdeteksi berada di ${this.hasillatlong.display_name}. Aktifkan GPS untuk lokasi lebih akurat`,
            actions: [{ icon: "close", color: "white" }]
          });
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },
    async getLocation() {
      if (navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition(position => {
          this.pos = position.coords;
          this.reverseLatlong(this.pos.latitude, this.pos.longitude);
        });
      } else {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "Geolocation Tidak Support",
          icon: "report_problem"
        });
      }
    },
    redirectKajian() {
      return this.$router.push("/kajian");
    },
    redirect(text) {
      return this.$router.push(`/kajian/cari/${text}`);
    },
    onRowClick(evt, row) {
      return this.$router.push(`/kajian/id/${row.id}`);
    },
    async loadData() {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/kajian/today`)
        .then(response => {
          this.data = response.data.data;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },

    async loadFlyer() {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/flyer`)
        .then(response => {
          this.flyer = response.data;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },

    async loadLatLong() {
      await this.$axios
        .get(
          `https://locationiq.org/v1/search.php?key=3d0e63349939df&q=${this.data[0].masjid.alamat.nama}&format=json`
        )
        .then(response => {
          this.latlong = response.data;
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
    var date = new Date().getDate();
    var lokasi = localStorage.getItem(`lokasi${date}`);
    if (!lokasi) {
      localStorage.clear();
      await this.getLocation();
    }

    await this.loadData();
    await this.loadFlyer();
    this.lokasi = JSON.parse(localStorage.getItem(`lokasi${date}`));
    this.loading = false;
  }
};
</script>
