import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Session } from "../storage";
import {
  buildTimestamp,
  formatDateLabel,
  formatDuration,
  pad,
  to12Hour,
  to24Hour,
} from "../utils/time";

type TimeFields = { hour: string; minute: string; isPM: boolean };

function timeFieldsFromEpoch(epochMs: number): TimeFields {
  const d = new Date(epochMs);
  const { hour12, isPM } = to12Hour(d.getHours());
  return { hour: String(hour12), minute: pad(d.getMinutes()), isPM };
}

function TimeEditor({
  label,
  fields,
  onChange,
}: {
  label: string;
  fields: TimeFields;
  onChange: (fields: TimeFields) => void;
}) {
  return (
    <View style={styles.timeBlock}>
      <Text style={styles.timeLabel}>{label}</Text>
      <View style={styles.timeRow}>
        <TextInput
          style={styles.timeInput}
          keyboardType="number-pad"
          value={fields.hour}
          onChangeText={(v) => onChange({ ...fields, hour: v })}
          selectTextOnFocus
        />
        <Text style={styles.colon}>:</Text>
        <TextInput
          style={styles.timeInput}
          keyboardType="number-pad"
          value={fields.minute}
          onChangeText={(v) => onChange({ ...fields, minute: v })}
          selectTextOnFocus
        />
        <View style={styles.ampmGroup}>
          <Pressable
            style={[styles.ampmButton, !fields.isPM && styles.ampmButtonActive]}
            onPress={() => onChange({ ...fields, isPM: false })}
          >
            <Text style={[styles.ampmText, !fields.isPM && styles.ampmTextActive]}>
              AM
            </Text>
          </Pressable>
          <Pressable
            style={[styles.ampmButton, fields.isPM && styles.ampmButtonActive]}
            onPress={() => onChange({ ...fields, isPM: true })}
          >
            <Text style={[styles.ampmText, fields.isPM && styles.ampmTextActive]}>
              PM
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function EditSessionModal({
  session,
  onClose,
  onSave,
  onDelete,
}: {
  session: Session | null;
  onClose: () => void;
  onSave: (id: string, startTime: number, endTime: number) => void;
  onDelete: (id: string) => void;
}) {
  const [startFields, setStartFields] = useState<TimeFields>({
    hour: "12",
    minute: "00",
    isPM: false,
  });
  const [endFields, setEndFields] = useState<TimeFields>({
    hour: "12",
    minute: "00",
    isPM: false,
  });
  const [endsNextDay, setEndsNextDay] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (session) {
      setStartFields(timeFieldsFromEpoch(session.startTime));
      setEndFields(timeFieldsFromEpoch(session.endTime));
      const startDay = new Date(session.startTime).toDateString();
      const endDay = new Date(session.endTime).toDateString();
      setEndsNextDay(startDay !== endDay);
      setConfirmingDelete(false);
    }
  }, [session]);

  if (!session) return null;

  const parseFields = (fields: TimeFields) => {
    const hour12 = Math.min(12, Math.max(1, parseInt(fields.hour, 10) || 12));
    const minute = Math.min(59, Math.max(0, parseInt(fields.minute, 10) || 0));
    return to24Hour(hour12, fields.isPM) * 60 + minute;
  };

  const newStartTime = buildTimestamp(
    session.startTime,
    Math.floor(parseFields(startFields) / 60),
    parseFields(startFields) % 60
  );
  const newEndTime = buildTimestamp(
    session.startTime,
    Math.floor(parseFields(endFields) / 60),
    parseFields(endFields) % 60,
    endsNextDay ? 1 : 0
  );
  const isValid = newEndTime > newStartTime;

  const handleSave = () => {
    if (!isValid) return;
    onSave(session.id, newStartTime, newEndTime);
    onClose();
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{formatDateLabel(session.startTime)}</Text>
          <Text style={styles.subtitle}>Edit start / end time</Text>

          <TimeEditor label="Start" fields={startFields} onChange={setStartFields} />
          <TimeEditor label="End" fields={endFields} onChange={setEndFields} />

          <Pressable
            style={styles.nextDayRow}
            onPress={() => setEndsNextDay((v) => !v)}
          >
            <View style={[styles.checkbox, endsNextDay && styles.checkboxChecked]} />
            <Text style={styles.nextDayText}>Ends the next day</Text>
          </Pressable>

          {isValid ? (
            <Text style={styles.durationPreview}>
              Duration: {formatDuration(newEndTime - newStartTime)}
            </Text>
          ) : (
            <Text style={styles.errorText}>End time must be after start time.</Text>
          )}

          {confirmingDelete ? (
            <View style={styles.confirmRow}>
              <Text style={styles.confirmText}>Delete this entry?</Text>
              <View style={styles.confirmButtons}>
                <Pressable
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => setConfirmingDelete(false)}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => {
                    onDelete(session.id);
                    onClose();
                  }}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.actionRow}>
                <Pressable
                  style={[styles.button, styles.secondaryButton]}
                  onPress={onClose}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.button,
                    styles.saveButton,
                    !isValid && styles.buttonDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={!isValid}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.deleteLink}
                onPress={() => setConfirmingDelete(true)}
              >
                <Text style={styles.deleteLinkText}>Delete entry</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#d8d8d8",
  },
  subtitle: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
    marginBottom: 20,
  },
  timeBlock: {
    marginBottom: 16,
  },
  timeLabel: {
    color: "#999",
    fontSize: 13,
    marginBottom: 6,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeInput: {
    width: 56,
    borderRadius: 10,
    backgroundColor: "#1c1c1c",
    color: "#d8d8d8",
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 10,
  },
  colon: {
    color: "#d8d8d8",
    fontSize: 20,
    fontWeight: "700",
  },
  ampmGroup: {
    flexDirection: "row",
    marginLeft: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  ampmButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#1c1c1c",
  },
  ampmButtonActive: {
    backgroundColor: "#3a7bd5",
  },
  ampmText: {
    color: "#999",
    fontWeight: "700",
    fontSize: 13,
  },
  ampmTextActive: {
    color: "#fff",
  },
  nextDayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#999",
  },
  checkboxChecked: {
    backgroundColor: "#3a7bd5",
    borderColor: "#3a7bd5",
  },
  nextDayText: {
    color: "#d8d8d8",
    fontSize: 14,
  },
  durationPreview: {
    color: "#d8d8d8",
    fontSize: 14,
    marginBottom: 20,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  confirmRow: {
    gap: 12,
  },
  confirmText: {
    color: "#d8d8d8",
    fontSize: 15,
    textAlign: "center",
  },
  confirmButtons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  secondaryButton: {
    backgroundColor: "#3a3a3a",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryButtonText: {
    color: "#d8d8d8",
    fontWeight: "600",
    fontSize: 15,
  },
  deleteLink: {
    marginTop: 16,
    alignItems: "center",
  },
  deleteLinkText: {
    color: "#e74c3c",
    fontSize: 14,
    fontWeight: "600",
  },
});
