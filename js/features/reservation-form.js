import { NOOP_FEATURE, on, qs } from "../core/dom.js";

/**
 * Sabor Quiteño — reservation form
 *
 * Turns the two-field form into a prefilled WhatsApp deep link. Fields are
 * resolved by `name`, never by DOM position, so reordering the markup cannot
 * silently send the wrong data.
 */
export function createReservationForm({ form, window: win, settings }) {
  if (!form) return NOOP_FEATURE;

  const name = qs('input[name="name"]', form);
  const whatsapp = qs('input[name="whatsapp"]', form);
  if (!name || !whatsapp) return NOOP_FEATURE;

  const buildMessage = () => {
    const fullName = (name.value || "Hola").trim();
    const phone = (whatsapp.value || "").trim();
    return `Hola Sabor Quiteño, soy ${fullName} ${phone} — quisiera reservar mesa.`;
  };

  return {
    bind() {
      return on(form, "submit", (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        const url = `https://wa.me/${settings.reservation.whatsappNumber}?text=${encodeURIComponent(buildMessage())}`;
        win.open(url, "_blank", "noopener");
      });
    },
    destroy() {},
  };
}
