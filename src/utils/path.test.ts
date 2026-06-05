import { describe, it, expect } from 'vitest';
import * as paths from './path';

describe('path constants', () => {
  it('homePath is "/"', () => expect(paths.homePath).toBe('/'));
  it('authLoginPath', () => expect(paths.authLoginPath).toBe('/auth/login'));
  it('authRegisterPath', () => expect(paths.authRegisterPath).toBe('/auth/register'));
  it('authRegisterDoctorPath', () => expect(paths.authRegisterDoctorPath).toBe('/auth/register/doctor'));
  it('authRegisterPatientPath', () => expect(paths.authRegisterPatientPath).toBe('/auth/register/owner'));
  it('authResetPasswordPath', () => expect(paths.authResetPasswordPath).toBe('/auth/reset-password'));
  it('aboutPath', () => expect(paths.aboutPath).toBe('/about'));
  it('contactPath', () => expect(paths.contactPath).toBe('/contact'));
  it('privacyPath', () => expect(paths.privacyPath).toBe('/privacy'));
  it('doctorsPath', () => expect(paths.doctorsPath).toBe('/doctors'));
  it('patientSummaryPath', () => expect(paths.patientSummaryPath).toBe('/patient-summary'));
  it('appointmentDetailsPath', () => expect(paths.appointmentDetailsPath).toBe('/appointment-details'));
  it('appointmentSummaryPath', () => expect(paths.appointmentSummaryPath).toBe('/appointment-summary'));
  it('dashboardPatientPath', () => expect(paths.dashboardPatientPath).toBe('/dashboard/owner'));
  it('dashboardDoctorPath', () => expect(paths.dashboardDoctorPath).toBe('/dashboard/doctor'));
});
