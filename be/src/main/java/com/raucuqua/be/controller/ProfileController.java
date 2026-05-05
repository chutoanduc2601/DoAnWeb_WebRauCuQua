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
    public ResponseEntity<List<Profile>> getAllProfiles() {
        return ResponseEntity.ok(profileRepository.findAll());
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
            // Role and email usually shouldn't be edited by user directly in this way, 
            // but for simplicity we can allow name, phone, address.
            return ResponseEntity.ok(profileRepository.save(profile));
        } else {
            // Create profile if it doesn't exist
            profileDetails.setId(id);
            return ResponseEntity.ok(profileRepository.save(profileDetails));
        }
    }
}
