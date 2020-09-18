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
      <q-img v-if="guru.foto" :src="guru.foto">
        <q-item
          @click="redirectProfile(guru.id)"
          class="teks absolute-bottom text-subtitle2 text-center"
          v-ripple
          clickable
          style="white-space: nowrap !important; display:block"
        >
          {{ guru.nama }}
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
              <td>: {{ guru.tgl_lahir }}</td>
            </tr>
            <tr>
              <td><b>Tempat Lahir</b></td>
              <td>
                :
                {{
                  guru.tempat_lahir == null ? "Belum ada" : guru.tempat_lahir
                }}
              </td>
            </tr>
            <tr>
              <td><b>Lulusan</b></td>
              <td>
                : {{ guru.lulusan == null ? "Belum ada" : guru.lulusan }}
              </td>
            </tr>
            <tr>
              <td><b>Kajian</b></td>
              <td>
                : {{ guru.kajian == null ? "Belum ada" : guru.kajian.length }}
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
      <p :class="$style.red">
    This should be red
  </p>
  </div>
</template>

<script>
import Guru from 'models/Guru';

export default {
  name: "GuruComponent",
  data() {
    return {
      loading: true,
      text: "",
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
          Guru.create({
            data : response.data
          })
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
  async mounted() {
    console.log("warna : " + JSON.stringify(this.$style))
    await this.loadData();
    this.profile = this.guru.profile
      ? this.guru.profile.substring(0, 255) + ".."
      : "";
    this.loading = false;
  },
  computed:{
    guru(){
      return Guru.query().last();
    }
  }
};
</script>

<style lang="css" src="./GuruComponent.css" module/>
