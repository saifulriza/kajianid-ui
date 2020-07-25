<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card class="my-card">
      <q-img
        src="https://img.freepik.com/free-vector/happy-islamic-new-year-holiday-banner_1017-20519.jpg?size=626&ext=jpg"
      >
        <div class="absolute-bottom">
          <div class="text-h6">InfoKajian</div>
        </div>
      </q-img>
      <q-card>
        <q-separator inset />
        <q-card class="q-ma-sm fixed-center" v-if="error">
          {{ this.error }}
        </q-card>
        <q-card-section>
          <q-input
            outlined
            label="Email"
            v-model="form.email"
            class="q-pa-md"
          />
          <q-input
            outlined
            class="q-pa-md"
            v-model="form.password"
            :type="isPwd ? 'password' : ''"
            label="Password"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input outlined label="Role" v-model="form.role" class="q-pa-md" />

          <q-slide-item @left="onLeft" class="tombol">
            <template v-slot:left>
              <div class="row items-center">
                <q-icon name="done" />
                <div class="absolute-center">
                  <q-circular-progress
                    indeterminate
                    size="50px"
                    :thickness="0.22"
                    color="primary"
                    track-color="grey-3"
                    class="q-ma-md"
                  />
                </div>
              </div>
            </template>

            <q-item>
              <q-item-section avatar class="grab">
                <q-avatar
                  color="primary"
                  text-color="white"
                  icon="fingerprint"
                />
              </q-item-section>
              <q-item-section>Geser kekanan untuk login</q-item-section>
            </q-item>
          </q-slide-item>
        </q-card-section>
      </q-card>
    </q-card>
  </q-page>
</template>

<script>
import fs from "fs";
export default {
  data() {
    return {
      email: "",
      password: "",
      isPwd: true,
      form: {},
      error: false,
      submitting: false,
      data: []
    };
  },
  methods: {
    async onLeft({ reset }) {
      // this[`loading${number}`] = true
      this.submitting = true;
      await this.$axios
        .post(`${process.env.API_URL}/api/v1/admin/login`, this.form)
        .then(res => {
          this.data = res.data;
          if (res.data.success) {
            localStorage.removeItem("user");
            localStorage.removeItem("K0lgfWr");
            localStorage.removeItem("kode_r");
            localStorage.removeItem("kode_e");
            localStorage.removeItem("dashboard");
            localStorage.setItem("user", JSON.stringify(this.data.data));
            localStorage.setItem("kode_r", this.data.kode_r);
            localStorage.setItem("kode_e", this.data.kode_e);
            localStorage.setItem("K0lgfWr", this.data.K0lgfWr);
            localStorage.setItem(
              "dashboard",
              JSON.stringify(this.data.redirect)
            );

            this.$router.push(`/${this.data.redirect}`);
          } else {
            this.$q.notify("Login gagal!");
            this.finalize(reset);
          }
        })
        .catch(err => {
          this.submitting = false;
          this.$q.notify({
            message: "Anda tidak memasukkan email/password/role dengan benar",
            color: "red",
            multiLine: true,
            avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
            actions: [{ label: "Close", color: "yellow" }]
          });
          this.finalize(reset);
        });
    },

    finalize(reset) {
      this.timer = setTimeout(() => {
        reset();
      }, 1000);
    }

    // end method login
  }
};
</script>
