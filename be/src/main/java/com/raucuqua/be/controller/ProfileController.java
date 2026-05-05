package com.raucuqua.be.controller;

import com.raucuqua.be.entity.Profile;
import com.raucuqua.be.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileRepository profileRepository;

    @GetMapping
    public ResponseEntity<java.util.List<Profile>> getAllProfiles(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String email) {
        
        java.util.List<Profile> allProfiles = profileRepository.findAll();

        if (email != null && !email.isEmpty()) {
            String targetEmail = email.trim().toLowerCase();
            java.util.List<Profile> found = allProfiles.stream()
                .filter(p -> p.getEmail() != null && p.getEmail().trim().toLowerCase().equals(targetEmail))
                .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(found);
        }

        if ("internal".equals(type)) {
            java.util.List<Profile> internal = allProfiles.stream()
                .filter(p -> p.getRole() != null && 
                       (p.getRole().equalsIgnoreCase("admin") || p.getRole().equalsIgnoreCase("staff")))
                .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(internal);
        }
        
        return ResponseEntity.ok(allProfiles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profile> getProfile(@PathVariable UUID id) {
        return profileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profile> updateProfile(@PathVariable UUID id, @RequestBody Profile profileDetails) {
        Optional<Profile> profileOptional = profileRepository.findById(id);
        if (profileOptional.isPresent()) {
            Profile profile = profileOptional.get();
            profile.setName(profileDetails.getName());
            profile.setPhone(profileDetails.getPhone());
            profile.setAddress(profileDetails.getAddress());
            profile.setRole(profileDetails.getRole());
            return ResponseEntity.ok(profileRepository.save(profile));
        } else {
            profileDetails.setId(id);
            return ResponseEntity.ok(profileRepository.save(profileDetails));
        }
    }
}
