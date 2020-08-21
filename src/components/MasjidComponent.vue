<template>
  <!-- drawer kiri -->
  <div>
    <q-input
      filled
      v-model="text"
      :dense="dense"
      @keydown.enter="redirect(text)"
      class="q-ma-sm"
      placeholder="Cari Masjid.."
    >
      <template v-slot:append>
        <q-icon name="fa fa-search" />
      </template>
    </q-input>
    <!-- skeleton -->
    <q-card flat style="max-width: 300px" class="q-ma-sm" v-if="loading">
      <q-skeleton height="150px" square />

      <q-card-section>
        <q-skeleton type="text" class="text-subtitle1" />
        <q-skeleton type="text" width="50%" class="text-subtitle1" />
        <q-skeleton type="text" class="text-caption" />
      </q-card-section>
    </q-card>
    <!-- end skeleton -->
    <q-card class="my-card q-ma-sm height-300" v-if="!loading">
      <q-img
        v-if="typeof masjids.foto[0] !== 'undefined'"
        :src="masjids.foto[0].link"
      >
        <q-item
          @click="redirectProfile(masjids.id)"
          class="teks absolute-bottom text-subtitle2 text-center"
          v-ripple
          clickable
          style="white-space: nowrap !important; display:block"
        >
          {{ masjids.nama }}
        </q-item>
      </q-img>
      <q-img
        v-if="typeof masjids.foto[0] == 'undefined'"
        src="https://kajianid.riza.my.id/404.jpg"
      >
        <q-item
          @click="redirectProfile(masjids.id)"
          class="teks absolute-bottom text-subtitle2 text-center"
          v-ripple
          clickable
          style="white-space: nowrap !important; display:block"
        >
          {{ masjids.nama }}
        </q-item>
      </q-img>

      <q-card-actions>
        <q-btn
          outline
          color="primary"
          v-if="profile"
          align="center"
          no-caps
          class="text-caption "
        >
          <q style="color:black"
            ><i>{{ profile }}</i></q
          >
        </q-btn>
        <div class="q-ma-sm text-caption">
          <table>
            <tr>
              <td><b>Jenis</b></td>
              <td>: {{ masjids.jenis }}</td>
            </tr>
            <tr>
              <td><b>Review</b></td>
              <td>
                :
                {{
                  masjids.review == null ? "Belum ada" : masjids.review.length
                }}
              </td>
            </tr>
            <tr>
              <td><b>alamat</b></td>
              <td>
                :
                {{ masjids.alamat == null ? "Belum ada" : masjids.alamat.nama }}
              </td>
            </tr>
            <tr>
              <td><b>Kajian</b></td>
              <td>
                :
                {{
                  masjids.kajian == null ? "Belum ada" : masjids.kajian.length
                }}
              </td>
            </tr>
          </table>
        </div>
      </q-card-actions>
    </q-card>
    <q-card class="my-card q-ma-sm">
      <q-item>
        <q-item-section>
          <q-btn
            to="/masjid"
            outline
            rounded
            color="primary"
            label="Lihat Selengkapnya.."
          />
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "MasjidComponent",
  data() {
    return {
      text: "",
      masjids: {},
      dense: false,
      loading: true,
      profile: ""
    };
  },
  methods: {
    redirect(text) {
      return this.$router.push(`/masjid/cari/${text}`);
    },
    redirectProfile(id) {
      return this.$router.push(`/masjid/id/${id}`);
    },
    async loadData() {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/masjid/random`)
        .then(response => {
          this.masjids = response.data;
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
  async created() {
    await this.loadData();
    this.profile = this.masjids.profil.substring(0, 255) + "..";
    this.loading = false;
  }
};
</script>

<style scoped>
.q-img {
  height: 200px;
  width: 282px;
}
</style>
