<template>
  <!-- drawer kiri -->
  <div>
    <q-input
      filled
      v-model="text"
      @keydown.enter="redirect(text)"
      :dense="dense"
      class="q-ma-sm"
      placeholder="Cari Ustadz.."
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
      <q-img v-if="gurus.foto" :src="gurus.foto">
        <q-item
          @click="redirectProfile(gurus.id)"
          class="teks absolute-bottom text-subtitle2 text-center"
          v-ripple
          clickable
          style="white-space: nowrap !important; display:block"
        >
          {{ gurus.nama }}
        </q-item>
      </q-img>

      <q-card-actions>
        <q-btn
          outline
          color="primary"
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
              <td><b>Tanggal Lahir</b></td>
              <td>: {{ gurus.tgl_lahir }}</td>
            </tr>
            <tr>
              <td><b>Tempat Lahir</b></td>
              <td>
                :
                {{
                  gurus.tempat_lahir == null ? "Belum ada" : gurus.tempat_lahir
                }}
              </td>
            </tr>
            <tr>
              <td><b>Lulusan</b></td>
              <td>
                : {{ gurus.lulusan == null ? "Belum ada" : gurus.lulusan }}
              </td>
            </tr>
            <tr>
              <td><b>Kajian</b></td>
              <td>
                : {{ gurus.kajian == null ? "Belum ada" : gurus.kajian.length }}
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
            outline
            rounded
            color="primary"
            label="Lihat Selengkapnya.."
            to="/guru"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "GuruComponent",
  data() {
    return {
      loading: true,
      text: "",
      gurus: {},
      dense: false,
      profile: ""
    };
  },
  methods: {
    redirectProfile(id) {
      return this.$router.push(`/guru/id/${id}`);
    },
    redirect(text) {
      return this.$router.push(`/guru/cari/${text}`);
    },
    async loadData() {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/guru/random`)
        .then(response => {
          this.gurus = response.data;
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
    this.profile = this.gurus.profile
      ? this.gurus.profile.substring(0, 255) + ".."
      : "";
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
